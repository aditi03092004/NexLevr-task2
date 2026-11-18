import {
  BrandProfile,
  PlannerOutput,
  ResearcherOutput,
  WriterOutput,
  ReviewerReport,
  ToolExecutionLog,
} from "../types";
import { callGeminiJson, getGeminiApiKey } from "../services/gemini";
import { generateDemoReviewerReport } from "../services/demoData";

export interface ReviewerExecutionResult {
  report: ReviewerReport;
  logs: ToolExecutionLog[];
  isDemo: boolean;
}

export async function runReviewerAgent(
  brand: BrandProfile,
  planner: PlannerOutput,
  researcher: ResearcherOutput,
  writer: WriterOutput,
  forceDemo = false
): Promise<ReviewerExecutionResult> {
  const startTime = Date.now();
  const logs: ToolExecutionLog[] = [];
  const hasKey = !!getGeminiApiKey();

  // If forced demo or missing key, use demo reviewer report
  if (forceDemo || !hasKey) {
    const demoReport = generateDemoReviewerReport(writer, researcher);
    logs.push({
      id: `log-rev-demo-${Date.now()}`,
      timestamp: new Date().toISOString(),
      agentName: "Reviewer",
      toolName: "claim_verification (demo mode)",
      inputSummary: `Audited ${demoReport.totalClaims} claims against ${demoReport.sourcesChecked} sources.`,
      outputSummary: `Quality Score: ${demoReport.qualityScore}/100. Verdict: ${demoReport.overallVerdict}. ${demoReport.supportedClaims} Green, ${demoReport.needsVerificationClaims} Yellow, ${demoReport.unsupportedClaims} Red.`,
      status: "INFO",
      durationMs: Date.now() - startTime,
      details: {
        mode: "demo",
        qualityScore: demoReport.qualityScore,
        verdict: demoReport.overallVerdict,
        totalClaims: demoReport.totalClaims,
      },
    });

    return {
      report: demoReport,
      logs,
      isDemo: true,
    };
  }

  // Live AI adversarial review via Gemini
  const systemPrompt = `You are the Lead Quality Assurance, Fact-Checking, and Reviewer Agent.
Your job is to rigorously, objectively, and adversarially audit the generated content against the collected research sources.

CRITICAL FACT-CHECKING RULES:
1. Identify all empirical factual claims, statistics, percentages, and benchmark assertions across the Blog, Social Posts, and Newsletter.
2. Cross-reference every claim strictly against the PROVIDED RESEARCH SOURCES.
3. Categorize each claim into one of three statuses:
   - GREEN: Directly corroborated by the provided research sources.
   - YELLOW: Plausible or common-sense, but lacks direct cited evidence in the retrieved sources. Needs caution or attribution.
   - RED: Completely unsupported, exaggerated, contradicted by the research, or containing a hallucinated citation.
4. DO NOT automatically mark a claim as GREEN simply because a URL is listed next to it. Verify that the claim actually exists in the sources.
5. Check grammar, flow, brand voice adherence to "${brand.tone}", and flag any repetitive phrases across the content pieces.
6. Provide specific, actionable line edits (target, current text, suggested replacement, reason).
7. Calculate an honest 0-100 quality score and an overall verdict: "PASSED" (>=90 score, 0 Red), "PASSED_WITH_WARNINGS" (>=75, <=1 Red), or "NEEDS_REVISION" (<75 or >1 Red).
8. Return strictly valid JSON adhering to the specified schema.`;

  const userPrompt = `Audit the generated content against the research sources below:

BRAND SPECIFICATIONS:
- Brand: ${brand.brandName} (${brand.industry})
- Requested Tone: ${brand.tone}
- Content Goal: ${brand.contentGoal}

AVAILABLE RESEARCH SOURCES (${researcher.sources.length} sources):
${researcher.sources
  .map(
    (s, idx) => `[Source ${idx + 1}]
Title: ${s.title}
URL: ${s.url}
Content Snippet: ${s.content.substring(0, 450)}`
  )
  .join("\n\n")}

VERIFIED FACTS EXTRACTED EARLIER:
${researcher.verifiedFacts.map((f) => `- ${f.fact} (${f.sourceUrl})`).join("\n")}

GENERATED CONTENT TO AUDIT:
[BLOG ARTICLE]
Headline: ${writer.blog.headline}
Intro: ${writer.blog.introduction.substring(0, 350)}...
Sections:
${writer.blog.sections.map((sec) => `### ${sec.heading}\n${sec.content}`).join("\n\n")}
Examples: ${writer.blog.examples.join(" | ")}

[SOCIAL POST 1 (${writer.socialPosts[0]?.platform || "Social"})]
${writer.socialPosts[0]?.hook}\n${writer.socialPosts[0]?.content}

[SOCIAL POST 2 (${writer.socialPosts[1]?.platform || "Social"})]
${writer.socialPosts[1]?.hook}\n${writer.socialPosts[1]?.content}

[SOCIAL POST 3 (${writer.socialPosts[2]?.platform || "Social"})]
${writer.socialPosts[2]?.hook}\n${writer.socialPosts[2]?.content}

[EMAIL NEWSLETTER]
Subject: ${writer.newsletter.subjectLine}
Intro: ${writer.newsletter.introduction}
Main Body: ${writer.newsletter.mainContent}
Key Takeaways: ${writer.newsletter.keyTakeaways.join(" | ")}

Return JSON matching this schema:
{
  "totalClaims": 6,
  "supportedClaims": 4,
  "unsupportedClaims": 0,
  "needsVerificationClaims": 2,
  "sourcesChecked": ${researcher.sources.length},
  "qualityScore": 91,
  "qualityScoreRationale": "2-3 sentences explaining the audit score",
  "grammarAndReadability": {
    "score": 95,
    "feedback": ["2-3 specific readability observations"]
  },
  "brandVoiceAdherence": {
    "score": 92,
    "feedback": ["Observations regarding tone consistency"]
  },
  "repetitionCheck": {
    "hasRepetition": false,
    "findings": ["Observations on vocabulary variety"]
  },
  "claims": [
    {
      "id": "claim-1",
      "claimText": "Specific factual claim found in text",
      "contentLocation": "e.g. Blog - Section 2",
      "status": "GREEN",
      "explanation": "Why this claim is supported or flagged",
      "matchedSource": {
        "title": "Title of supporting source if GREEN",
        "url": "URL of supporting source if GREEN"
      },
      "suggestedCorrection": "Optional correction if YELLOW or RED"
    }
  ],
  "suggestedCorrections": [
    {
      "target": "Blog - Section 1",
      "current": "Exact phrase to edit",
      "suggested": "Improved phrasing",
      "reason": "Why this correction improves accuracy or tone"
    }
  ],
  "overallVerdict": "PASSED"
}`;

  try {
    const { data, durationMs } = await callGeminiJson<ReviewerReport>(systemPrompt, userPrompt);

    // Enforce calculation consistency
    const claims = data.claims || [];
    const supported = claims.filter((c) => c.status === "GREEN").length;
    const needsVerif = claims.filter((c) => c.status === "YELLOW").length;
    const unsupported = claims.filter((c) => c.status === "RED").length;

    const report: ReviewerReport = {
      ...data,
      totalClaims: claims.length || data.totalClaims,
      supportedClaims: supported,
      needsVerificationClaims: needsVerif,
      unsupportedClaims: unsupported,
      sourcesChecked: researcher.sources.length,
      reviewedAt: new Date().toISOString(),
    };

    logs.push({
      id: `log-rev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      agentName: "Reviewer",
      toolName: "claim_verification",
      inputSummary: `Audited ${report.totalClaims} empirical claims across all generated content pieces against ${researcher.sources.length} sources.`,
      outputSummary: `Quality Score: ${report.qualityScore}/100. Verdict: ${report.overallVerdict}. [${supported} GREEN, ${needsVerif} YELLOW, ${unsupported} RED].`,
      status: unsupported > 0 ? "WARNING" : "SUCCESS",
      durationMs,
      details: {
        qualityScore: report.qualityScore,
        verdict: report.overallVerdict,
        totalClaims: report.totalClaims,
        supportedClaims: supported,
        unsupportedClaims: unsupported,
        needsVerificationClaims: needsVerif,
      },
    });

    return {
      report,
      logs,
      isDemo: false,
    };
  } catch (error: unknown) {
    const err = error as Error;
    logs.push({
      id: `log-rev-err-${Date.now()}`,
      timestamp: new Date().toISOString(),
      agentName: "Reviewer",
      toolName: "claim_verification",
      inputSummary: "Reviewing generated content",
      outputSummary: `Reviewer analysis failed: ${err.message}`,
      status: "ERROR",
      durationMs: Date.now() - startTime,
      errorMessage: err.message,
    });
    throw err;
  }
}
