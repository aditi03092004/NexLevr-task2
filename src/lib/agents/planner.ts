import { BrandProfile, PlannerOutput, ToolExecutionLog } from "../types";
import { callGeminiJson, getGeminiApiKey } from "../services/gemini";
import { generateDemoPlannerOutput } from "../services/demoData";

export interface PlannerExecutionResult {
  output: PlannerOutput;
  logs: ToolExecutionLog[];
  isDemo: boolean;
}

export async function runPlannerAgent(
  brand: BrandProfile,
  forceDemo = false
): Promise<PlannerExecutionResult> {
  const startTime = Date.now();
  const logs: ToolExecutionLog[] = [];
  const hasKey = !!getGeminiApiKey();

  // If forced demo or missing key, run realistic demo mode
  if (forceDemo || !hasKey) {
    const demoOutput = generateDemoPlannerOutput(brand);
    logs.push({
      id: `log-plan-${Date.now()}`,
      timestamp: new Date().toISOString(),
      agentName: "Planner",
      toolName: "planner_generation (demo mode)",
      inputSummary: `Brand: "${brand.brandName}", Industry: "${brand.industry}", Goal: "${brand.contentGoal}"`,
      outputSummary: `Generated strategic content theme: "${demoOutput.weeklyTheme}" with 3 audience insights and research questions.`,
      status: "INFO",
      durationMs: Date.now() - startTime,
      details: {
        mode: "demo",
        weeklyTheme: demoOutput.weeklyTheme,
        contentObjectives: demoOutput.contentObjectives,
      },
    });

    return {
      output: demoOutput,
      logs,
      isDemo: true,
    };
  }

  // Live AI execution via Gemini
  const systemPrompt = `You are the Lead Content Strategy & Planning Agent for an enterprise multi-agent content generation platform.
Your mission is to analyze the brand's identity, industry, target audience, and marketing objectives to produce a high-impact, cohesive weekly content strategy.
You must return a strictly valid JSON object matching the exact schema specified below. Do not include markdown code block formatting outside the JSON if possible, just raw JSON.`;

  const userPrompt = `Analyze the following brand profile and build a comprehensive weekly content package strategy:

BRAND NAME: ${brand.brandName}
DESCRIPTION: ${brand.brandDescription}
INDUSTRY: ${brand.industry}
TARGET AUDIENCE: ${brand.targetAudience}
WEBSITE: ${brand.website || "N/A"}
CONTENT GOAL: ${brand.contentGoal}
TONE OF VOICE: ${brand.tone}
TARGET KEYWORDS: ${brand.targetKeywords.join(", ") || "General industry keywords"}
PREFERRED PLATFORMS: ${brand.platforms.join(", ")}
LANGUAGE: ${brand.language || "English"}
CAMPAIGN PERIOD: ${brand.campaignPeriod || "Week 1"}

Return a JSON object adhering to this schema:
{
  "weeklyTheme": "A compelling, overarching weekly theme or narrative",
  "contentObjectives": ["3 to 4 clear, measurable marketing objectives"],
  "targetAudienceInsights": {
    "problems": ["3 urgent pain points or obstacles your audience faces"],
    "interests": ["3 topics, technologies, or themes the audience cares about"],
    "motivations": ["3 core desires or business drivers for the audience"]
  },
  "marketingStrategy": "2-3 sentences explaining the strategic positioning and connection across blog, social, and newsletter",
  "blogTopic": {
    "title": "A high-authority, SEO-optimized blog headline",
    "angle": "Specific analytical and research angle",
    "targetKeywords": ["3-5 high-intent keywords"]
  },
  "socialTopics": {
    "post1": {
      "platform": "${brand.platforms[0] || "LinkedIn"}",
      "type": "Educational & Informative",
      "topic": "Specific topic headline",
      "angle": "Educational breakdown with actionable takeaways"
    },
    "post2": {
      "platform": "${brand.platforms[1] || "X"}",
      "type": "Engaging Discussion Hook",
      "topic": "Engaging question or contrarian perspective",
      "angle": "Sparks comments and debate"
    },
    "post3": {
      "platform": "${brand.platforms[2] || "Instagram"}",
      "type": "Promotional & Thought Leadership",
      "topic": "Brand authority or visionary announcement",
      "angle": "Highlights brand expertise and solution"
    }
  },
  "newsletterTopic": {
    "subjectProposal": "High open-rate email subject line",
    "theme": "Core theme of the newsletter edition",
    "keyTakeaways": ["3 practical takeaways for subscribers"]
  },
  "suggestedKeywords": ["5-8 target search phrases"],
  "researchQuestions": [
    "3 specific, empirical research questions for the Researcher Agent to look up with real web data"
  ]
}`;

  try {
    const { data, durationMs } = await callGeminiJson<PlannerOutput>(systemPrompt, userPrompt);

    logs.push({
      id: `log-plan-${Date.now()}`,
      timestamp: new Date().toISOString(),
      agentName: "Planner",
      toolName: "gemini_planner_generation",
      inputSummary: `Brand: "${brand.brandName}", Industry: "${brand.industry}", Period: "${brand.campaignPeriod}"`,
      outputSummary: `Created strategic plan for theme: "${data.weeklyTheme}" with ${data.researchQuestions.length} research targets.`,
      status: "SUCCESS",
      durationMs,
      details: {
        weeklyTheme: data.weeklyTheme,
        blogTitle: data.blogTopic.title,
        questions: data.researchQuestions,
      },
    });

    return {
      output: data,
      logs,
      isDemo: false,
    };
  } catch (error: unknown) {
    const err = error as Error;
    logs.push({
      id: `log-plan-err-${Date.now()}`,
      timestamp: new Date().toISOString(),
      agentName: "Planner",
      toolName: "gemini_planner_generation",
      inputSummary: `Brand: "${brand.brandName}", Industry: "${brand.industry}"`,
      outputSummary: `Planner agent execution failed: ${err.message}`,
      status: "ERROR",
      durationMs: Date.now() - startTime,
      errorMessage: err.message,
    });
    throw err;
  }
}
