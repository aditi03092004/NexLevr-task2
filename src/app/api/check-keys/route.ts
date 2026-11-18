import { NextResponse } from "next/server";
import { getGeminiApiKey, getGeminiModelName } from "@/lib/services/gemini";
import { getTavilyApiKey } from "@/lib/services/tavily";

export const dynamic = "force-dynamic";

export async function GET() {
  const geminiKey = getGeminiApiKey();
  const tavilyKey = getTavilyApiKey();

  return NextResponse.json({
    hasGeminiKey: !!geminiKey && geminiKey.trim().length > 0,
    hasTavilyKey: !!tavilyKey && tavilyKey.trim().length > 0,
    geminiModel: getGeminiModelName(),
    demoModeAvailable: true,
  });
}
