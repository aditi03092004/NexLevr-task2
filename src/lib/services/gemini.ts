import { GoogleGenerativeAI } from "@google/generative-ai";

export function getGeminiApiKey(): string | null {
  return process.env.GEMINI_API_KEY || null;
}

export function getGeminiModelName(): string {
  return process.env.GEMINI_MODEL || "gemini-1.5-flash";
}

/**
 * Invoke Gemini with structured JSON output instructions
 */
export async function callGeminiJson<T>(
  systemPrompt: string,
  userPrompt: string,
  modelName?: string
): Promise<{ data: T; durationMs: number; rawText: string }> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }

  const startTime = Date.now();
  const genAI = new GoogleGenerativeAI(apiKey);
  const selectedModel = modelName || getGeminiModelName();

  const model = genAI.getGenerativeModel({
    model: selectedModel,
    generationConfig: {
      temperature: 0.4,
      responseMimeType: "application/json",
    },
    systemInstruction: systemPrompt,
  });

  try {
    const result = await model.generateContent(userPrompt);
    const durationMs = Date.now() - startTime;
    const response = await result.response;
    const rawText = response.text();

    if (!rawText) {
      throw new Error("Gemini returned an empty response.");
    }

    try {
      const data = JSON.parse(rawText) as T;
      return { data, durationMs, rawText };
    } catch {
      // In case model wraps in markdown json backticks despite mime type
      const cleaned = rawText.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
      const data = JSON.parse(cleaned) as T;
      return { data, durationMs, rawText };
    }
  } catch (error: unknown) {
    const err = error as Error;
    // Helpful error explanation for common issues like quota or invalid key
    if (err.message?.includes("API_KEY_INVALID")) {
      throw new Error("Invalid Gemini API key. Please check your GEMINI_API_KEY.");
    }
    if (err.message?.includes("RESOURCE_EXHAUSTED") || err.message?.includes("429")) {
      throw new Error("Gemini API rate limit or quota exceeded. Please retry in a few moments.");
    }
    throw err;
  }
}
