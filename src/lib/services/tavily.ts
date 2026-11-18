import { ResearchSource } from "../types";

export function getTavilyApiKey(): string | null {
  return process.env.TAVILY_API_KEY || null;
}

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score?: number;
  published_date?: string;
}

export interface TavilyResponse {
  query: string;
  answer?: string;
  results: TavilySearchResult[];
}

/**
 * Perform a live search using the Tavily Search API
 */
export async function searchTavily(
  query: string,
  maxResults = 5
): Promise<{ sources: ResearchSource[]; answer?: string; durationMs: number }> {
  const apiKey = getTavilyApiKey();
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is not configured in environment variables.");
  }

  const startTime = Date.now();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 18000); // 18s timeout

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "advanced",
        include_answer: true,
        include_raw_content: false,
        max_results: maxResults,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      let parsedMsg = errText;
      try {
        const parsed = JSON.parse(errText);
        parsedMsg = parsed.message || parsed.error || errText;
      } catch {
        // use raw errText
      }
      throw new Error(`Tavily search failed (${res.status}): ${parsedMsg}`);
    }

    const data = (await res.json()) as TavilyResponse;
    const durationMs = Date.now() - startTime;

    const sources: ResearchSource[] = (data.results || []).map((r, index) => ({
      id: `src-${Date.now()}-${index}`,
      title: r.title || "Untitled Web Source",
      url: r.url,
      content: r.content || "",
      publishedDate: r.published_date || undefined,
      score: r.score,
      sourceType: "web_search",
    }));

    return {
      sources,
      answer: data.answer,
      durationMs,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const error = err as Error;
    if (error.name === "AbortError") {
      throw new Error(`Tavily search timed out for query: "${query}"`);
    }
    throw error;
  }
}
