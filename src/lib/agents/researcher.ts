import {
  BrandProfile,
  PlannerOutput,
  ResearcherOutput,
  ResearchSource,
  VerifiedFact,
  VerifiedStatistic,
  ToolExecutionLog,
} from "../types";
import { searchTavily, getTavilyApiKey } from "../services/tavily";
import { callGeminiJson, getGeminiApiKey } from "../services/gemini";
import { generateDemoResearcherOutput } from "../services/demoData";

export interface ResearcherExecutionResult {
  output: ResearcherOutput;
  logs: ToolExecutionLog[];
  isDemo: boolean;
}

export async function runResearcherAgent(
  brand: BrandProfile,
  planner: PlannerOutput,
  forceDemo = false
): Promise<ResearcherExecutionResult> {
  const startTime = Date.now();
  const logs: ToolExecutionLog[] = [];
  const hasTavilyKey = !!getTavilyApiKey();
  const hasGeminiKey = !!getGeminiApiKey();

  // If forced demo or keys are missing, run demo mode
  if (forceDemo || !hasTavilyKey) {
    const demoOutput = generateDemoResearcherOutput(brand, planner);
    logs.push({
      id: `log-res-demo-${Date.now()}`,
      timestamp: new Date().toISOString(),
      agentName: "Researcher",
      toolName: "tavily_search (demo mode)",
      inputSummary: `Queries: "${planner.weeklyTheme}", "${planner.researchQuestions[0] || brand.industry}"`,
      outputSummary: `Loaded 4 curated benchmark research sources with statistics from MIT Sloan, Gartner, Stanford HAI, and HBR.`,
      status: "INFO",
      durationMs: Date.now() - startTime,
      details: {
        mode: "demo",
        sourceCount: demoOutput.sources.length,
        factCount: demoOutput.verifiedFacts.length,
        statCount: demoOutput.statistics.length,
      },
    });

    return {
      output: demoOutput,
      logs,
      isDemo: true,
    };
  }

  // Live Research via Tavily Search API
  const collectedSources: ResearchSource[] = [];
  const queryLogs: string[] = [];

  // Formulate queries from Planner output
  const queriesToSearch = [
    planner.weeklyTheme,
    ...(planner.researchQuestions || []).slice(0, 2),
    `${brand.industry} industry trends statistics 2024 2025`,
  ].slice(0, 3); // run top 3 targeted searches

  for (const query of queriesToSearch) {
    const qStart = Date.now();
    try {
      const { sources, durationMs } = await searchTavily(query, 4);
      queryLogs.push(`tavily.search("${query}") -> ${sources.length} results (${durationMs}ms)`);

      logs.push({
        id: `log-res-tavily-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        agentName: "Researcher",
        toolName: "tavily_search",
        inputSummary: `Query: "${query}" (maxResults: 4)`,
        outputSummary: `Retrieved ${sources.length} sources from live web index.`,
        status: "SUCCESS",
        durationMs,
        details: {
          query,
          retrievedUrls: sources.map((s) => s.url),
        },
      });

      // Deduplicate by URL
      for (const s of sources) {
        if (!collectedSources.some((existing) => existing.url === s.url)) {
          collectedSources.push(s);
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      logs.push({
        id: `log-res-tavily-err-${Date.now()}`,
        timestamp: new Date().toISOString(),
        agentName: "Researcher",
        toolName: "tavily_search",
        inputSummary: `Query: "${query}"`,
        outputSummary: `Tavily query failed: ${error.message}`,
        status: "WARNING",
        durationMs: Date.now() - qStart,
        errorMessage: error.message,
      });
    }
  }

  if (collectedSources.length === 0) {
    throw new Error(
      "Live web research could not retrieve valid sources. Please check your TAVILY_API_KEY, verify network connectivity, or retry."
    );
  }

  // Synthesize research findings using Gemini if available
  let verifiedFacts: VerifiedFact[] = [];
  let statistics: VerifiedStatistic[] = [];
  let industryTrends: string[] = [];
  let summary = "";

  if (hasGeminiKey) {
    const synthStart = Date.now();
    const systemPrompt = `You are the Research Analysis & Fact Extraction Agent.
You will receive raw search results from live web queries.
Extract verifiable empirical facts, statistics, and industry trends strictly from the provided source snippets.
CRITICAL RULE: NEVER invent, extrapolate, or hallucinate facts or URLs. Every fact and statistic MUST map directly to one of the provided source URLs. If a statistic cannot be found in the snippets, do not fabricate one.`;

    const userPrompt = `Analyze the following collected web sources regarding the theme "${planner.weeklyTheme}" for ${brand.brandName} (${brand.industry}):

COLLECTED SOURCES:
${collectedSources
  .map(
    (s, i) => `[Source ${i + 1}]
Title: ${s.title}
URL: ${s.url}
Published: ${s.publishedDate || "Unknown"}
Content: ${s.content.substring(0, 600)}`
  )
  .join("\n\n")}

Extract structured facts and statistics in the following JSON schema:
{
  "summary": "2-3 sentences synthesizing the core findings",
  "verifiedFacts": [
    {
      "fact": "Exact empirical statement extracted from the text",
      "sourceUrl": "The exact matching URL from the sources above",
      "sourceTitle": "The matching source title",
      "category": "e.g. Market Trends, Performance, or Efficiency"
    }
  ],
  "statistics": [
    {
      "statistic": "The quantitative metric or percentage",
      "sourceUrl": "The exact matching URL from the sources above",
      "sourceTitle": "The matching source title",
      "context": "Context of how this statistic was measured"
    }
  ],
  "industryTrends": [
    "3-4 current market trends evidenced by the sources"
  ]
}`;

    try {
      const { data, durationMs } = await callGeminiJson<{
        summary: string;
        verifiedFacts: { fact: string; sourceUrl: string; sourceTitle: string; category: string }[];
        statistics: { statistic: string; sourceUrl: string; sourceTitle: string; context: string }[];
        industryTrends: string[];
      }>(systemPrompt, userPrompt);

      summary = data.summary;
      verifiedFacts = data.verifiedFacts || [];
      statistics = data.statistics || [];
      industryTrends = data.industryTrends || [];

      logs.push({
        id: `log-res-synth-${Date.now()}`,
        timestamp: new Date().toISOString(),
        agentName: "Researcher",
        toolName: "gemini_fact_extraction",
        inputSummary: `Analyzed ${collectedSources.length} collected live sources`,
        outputSummary: `Extracted ${verifiedFacts.length} verified facts, ${statistics.length} statistics, and ${industryTrends.length} trends.`,
        status: "SUCCESS",
        durationMs,
        details: {
          verifiedFactsCount: verifiedFacts.length,
          statisticsCount: statistics.length,
        },
      });
    } catch (err: unknown) {
      const error = err as Error;
      logs.push({
        id: `log-res-synth-err-${Date.now()}`,
        timestamp: new Date().toISOString(),
        agentName: "Researcher",
        toolName: "gemini_fact_extraction",
        inputSummary: "Synthesizing research data",
        outputSummary: `Synthesis warning: ${error.message}. Falling back to direct extraction.`,
        status: "WARNING",
        durationMs: Date.now() - synthStart,
        errorMessage: error.message,
      });

      // Fallback extraction from source snippets
      summary = `Retrieved ${collectedSources.length} live web sources for ${planner.weeklyTheme}.`;
      verifiedFacts = collectedSources.slice(0, 4).map((s) => ({
        fact: s.content.substring(0, 160) + "...",
        sourceUrl: s.url,
        sourceTitle: s.title,
        category: "Web Finding",
      }));
      industryTrends = [
        "Rapid digital workflow transformation across the sector",
        "Increased focus on verifiable metrics and trustworthy data",
      ];
    }
  }

  const output: ResearcherOutput = {
    topic: planner.weeklyTheme,
    summary: summary || `Synthesized research across ${collectedSources.length} live sources.`,
    sources: collectedSources,
    verifiedFacts,
    statistics,
    industryTrends,
    isLiveSearch: true,
    queryLog: queryLogs,
    researchedAt: new Date().toISOString(),
  };

  return {
    output,
    logs,
    isDemo: false,
  };
}
