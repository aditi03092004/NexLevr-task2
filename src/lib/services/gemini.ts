import { GoogleGenerativeAI } from "@google/generative-ai";
import { repairMalformedJson, stripSensitiveCredentials } from "../security/defenseGuards";

export function getGeminiApiKey(): string | null {
  return process.env.GEMINI_API_KEY || null;
}

export function getGeminiModelName(): string {
  return process.env.GEMINI_MODEL || "gemini-1.5-flash";
}

/**
 * Invoke Gemini with structured JSON output instructions, timeout guard, resilient parsing, and exponential backoff retry
 */
export async function callGeminiJson<T>(
  systemPrompt: string,
  userPrompt: string,
  modelName?: string,
  maxRetries = 3
): Promise<{ data: T; durationMs: number; rawText: string }> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured. Please add it to your .env.local file or use Demo Mode.");
  }

  const startTime = Date.now();
  const genAI = new GoogleGenerativeAI(apiKey);
  const selectedModel = modelName || getGeminiModelName();

  const model = genAI.getGenerativeModel({
    model: selectedModel,
    generationConfig: {
      temperature: 0.35,
      responseMimeType: "application/json",
    },
    systemInstruction: systemPrompt,
  });

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt < maxRetries) {
    attempt++;
    try {
      // Execute with timeout race (25s)
      const generatePromise = model.generateContent(userPrompt);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Gemini API request timed out after 25 seconds.")), 25000)
      );

      const result = await Promise.race([generatePromise, timeoutPromise]);
      const durationMs = Date.now() - startTime;
      const response = await result.response;
      const rawText = response.text();

      if (!rawText) {
        throw new Error("Gemini returned an empty response.");
      }

      // Use Resilient JSON Repair Parser
      const repaired = repairMalformedJson<T>(rawText);
      if (repaired.success && repaired.data) {
        return { data: repaired.data, durationMs, rawText };
      }

      // If repair couldn't parse, throw specific syntax error
      throw new Error(`JSON deserialization failed: ${repaired.error || "Unknown formatting defect"}`);
    } catch (error: unknown) {
      const err = error as Error;
      lastError = err;

      // Check if transient rate limit / quota error
      const isRateLimit =
        err.message?.includes("RESOURCE_EXHAUSTED") ||
        err.message?.includes("429") ||
        err.message?.includes("Quota exceeded");

      if (isRateLimit && attempt < maxRetries) {
        // Exponential backoff delay: 1.5s, 3s, 6s
        const backoffMs = Math.pow(2, attempt) * 750 + Math.random() * 200;
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        continue;
      }

      // Translate common error messages into clean, user-friendly guidance
      if (err.message?.includes("API_KEY_INVALID")) {
        throw new Error("Invalid Gemini API key. Please verify that your GEMINI_API_KEY is valid and active at https://aistudio.google.com.");
      }
      if (isRateLimit) {
        throw new Error("Gemini API rate limit or quota exceeded. Please retry in a few moments or switch to Demo Mode.");
      }

      // Strip sensitive tokens and internal file paths
      const sanitizedMsg = stripSensitiveCredentials(err.message).replace(/([a-zA-Z]:\\[^\s]+)/g, "[INTERNAL_PATH]");
      throw new Error(sanitizedMsg);
    }
  }

  throw lastError || new Error("Failed to execute Gemini call after retries.");
}
