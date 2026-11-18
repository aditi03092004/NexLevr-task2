import {
  BrandProfile,
  PlannerOutput,
  ResearcherOutput,
  WriterOutput,
  ToolExecutionLog,
} from "../types";
import { callGeminiJson, getGeminiApiKey } from "../services/gemini";
import { generateDemoWriterOutput } from "../services/demoData";

export interface WriterExecutionResult {
  output: WriterOutput;
  logs: ToolExecutionLog[];
  isDemo: boolean;
}

export async function runWriterAgent(
  brand: BrandProfile,
  planner: PlannerOutput,
  researcher: ResearcherOutput,
  forceDemo = false
): Promise<WriterExecutionResult> {
  const startTime = Date.now();
  const logs: ToolExecutionLog[] = [];
  const hasKey = !!getGeminiApiKey();

  // If forced demo or missing key, use demo writer
  if (forceDemo || !hasKey) {
    const demoOutput = generateDemoWriterOutput(brand, planner, researcher);
    logs.push({
      id: `log-wri-demo-${Date.now()}`,
      timestamp: new Date().toISOString(),
      agentName: "Writer",
      toolName: "writer_generation (demo mode)",
      inputSummary: `Theme: "${planner.weeklyTheme}", Sources: ${researcher.sources.length}`,
      outputSummary: `Generated complete content package: 1 Blog Article ("${demoOutput.blog.headline}"), 3 Social Posts, 1 Email Newsletter.`,
      status: "INFO",
      durationMs: Date.now() - startTime,
      details: {
        mode: "demo",
        blogHeadline: demoOutput.blog.headline,
        socialPostCount: demoOutput.socialPosts.length,
        newsletterSubject: demoOutput.newsletter.subjectLine,
      },
    });

    return {
      output: demoOutput,
      logs,
      isDemo: true,
    };
  }

  // Live generation with Gemini
  const systemPrompt = `You are the Lead Content Writer & Copywriting Architect for an elite AI multi-agent platform.
Your objective is to craft a premium, high-impact weekly content package (Blog Article, 3 Social Media Posts, and Email Newsletter) tailored to the brand's voice and backed directly by verified research.

RULES FOR WRITING:
1. Ground empirical facts and numbers in the provided research. Never invent facts, percentages, or sources.
2. Tone of voice: strictly adhere to the requested brand tone. Avoid generic AI fluff, repetitive phrasing, and clichés.
3. Blog Article: structure with clear headings, actionable analysis, real-world examples, references with actual source URLs, and an engaging CTA.
4. Social Media:
   - Post 1: Educational and informative (breakdown of a core insight).
   - Post 2: Engaging discussion hook (contrarian question, debate starter).
   - Post 3: Promotional or thought leadership (positioning brand authority).
   - Tailor formatting and length to the user's selected platforms (${brand.platforms.join(", ") || "LinkedIn, Instagram, X"}).
5. Email Newsletter: compelling subject line, curiosity-inducing preview text, warm greeting, engaging body, key takeaways, and a decisive CTA.
6. Return strictly valid JSON matching the schema.`;

  const userPrompt = `Create a complete content package based on this brand strategy and verified research:

BRAND INFORMATION:
- Brand Name: ${brand.brandName}
- Description: ${brand.brandDescription}
- Industry: ${brand.industry}
- Tone: ${brand.tone}
- Content Goal: ${brand.contentGoal}
- Target Audience: ${brand.targetAudience}
- Target Keywords: ${brand.targetKeywords.join(", ")}
- Selected Platforms: ${brand.platforms.join(", ")}
- Language: ${brand.language}

PLANNER STRATEGY:
- Weekly Theme: ${planner.weeklyTheme}
- Marketing Strategy: ${planner.marketingStrategy}
- Blog Topic: ${planner.blogTopic.title} (Angle: ${planner.blogTopic.angle})
- Newsletter Proposal: ${planner.newsletterTopic.subjectProposal}

RESEARCH MATERIAL TO INTEGRATE:
${researcher.verifiedFacts
  .map((f, i) => `Fact ${i + 1}: ${f.fact} [Source: ${f.sourceTitle} - ${f.sourceUrl}]`)
  .join("\n")}

${researcher.statistics
  .map((s, i) => `Statistic ${i + 1}: ${s.statistic} (${s.context}) [Source: ${s.sourceUrl}]`)
  .join("\n")}

RESEARCH SOURCES AVAILABLE:
${researcher.sources
  .slice(0, 5)
  .map((s) => `- ${s.title}: ${s.url}`)
  .join("\n")}

Return JSON in this exact structure:
{
  "blog": {
    "headline": "Captivating, SEO-optimized title",
    "metaDescription": "1-2 sentence search snippet",
    "readTime": "e.g. 5 min read",
    "introduction": "Engaging 2-3 paragraph hook and thesis",
    "sections": [
      {
        "heading": "Clear Section Heading",
        "content": "In-depth, informative paragraphs incorporating verified research findings and citations"
      }
    ],
    "examples": ["2 concrete real-world use cases or scenarios illustrating the points"],
    "conclusion": "Synthesis of key ideas and strategic outlook",
    "callToAction": "Clear, brand-aligned call to action",
    "references": [
      {
        "title": "Exact title of research source",
        "url": "Exact URL from provided research sources"
      }
    ]
  },
  "socialPosts": [
    {
      "id": "post-1",
      "type": "educational",
      "platform": "${brand.platforms[0] || "LinkedIn"}",
      "hook": "Attention-grabbing opening line",
      "content": "Informative educational breakdown with bullet points and research insight",
      "callToAction": "Comment/share CTA",
      "hashtags": ["#Tag1", "#Tag2", "#Tag3"]
    },
    {
      "id": "post-2",
      "type": "engaging",
      "platform": "${brand.platforms[1] || "X"}",
      "hook": "Contrarian or thought-provoking question hook",
      "content": "Engaging discussion copy challenging common assumptions",
      "callToAction": "Discussion question",
      "hashtags": ["#Tag1", "#Tag2"]
    },
    {
      "id": "post-3",
      "type": "thought_leadership",
      "platform": "${brand.platforms[2] || "Instagram"}",
      "hook": "Visionary brand statement hook",
      "content": "Authority-building perspective on where the industry is heading",
      "callToAction": "Link in bio / explore more CTA",
      "hashtags": ["#Tag1", "#Tag2", "#Tag3"]
    }
  ],
  "newsletter": {
    "subjectLine": "Compelling subject line",
    "previewText": "Preview snippet shown in inbox",
    "greeting": "Personal greeting",
    "introduction": "Warm, relevant introductory hook",
    "mainContent": "Core narrative integrating the week's theme and verified research insights",
    "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
    "callToAction": "Decisive action prompt",
    "closing": "Professional sign-off"
  }
}`;

  try {
    const { data, durationMs } = await callGeminiJson<{
      blog: WriterOutput["blog"];
      socialPosts: WriterOutput["socialPosts"];
      newsletter: WriterOutput["newsletter"];
    }>(systemPrompt, userPrompt);

    const output: WriterOutput = {
      blog: data.blog,
      socialPosts: data.socialPosts,
      newsletter: data.newsletter,
      generatedAt: new Date().toISOString(),
    };

    logs.push({
      id: `log-wri-${Date.now()}`,
      timestamp: new Date().toISOString(),
      agentName: "Writer",
      toolName: "gemini_writer_generation",
      inputSummary: `Theme: "${planner.weeklyTheme}", Blog Angle: "${planner.blogTopic.angle}"`,
      outputSummary: `Generated Blog (${data.blog.sections?.length || 0} sections), 3 Social Posts for [${brand.platforms.join(", ")}], and Newsletter.`,
      status: "SUCCESS",
      durationMs,
      details: {
        blogHeadline: data.blog.headline,
        socialPostCount: data.socialPosts?.length || 0,
        newsletterSubject: data.newsletter?.subjectLine,
      },
    });

    return {
      output,
      logs,
      isDemo: false,
    };
  } catch (error: unknown) {
    const err = error as Error;
    logs.push({
      id: `log-wri-err-${Date.now()}`,
      timestamp: new Date().toISOString(),
      agentName: "Writer",
      toolName: "gemini_writer_generation",
      inputSummary: `Theme: "${planner.weeklyTheme}"`,
      outputSummary: `Writer generation failed: ${err.message}`,
      status: "ERROR",
      durationMs: Date.now() - startTime,
      errorMessage: err.message,
    });
    throw err;
  }
}
