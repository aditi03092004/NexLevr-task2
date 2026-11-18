import { NextRequest, NextResponse } from "next/server";
import { runResearcherAgent } from "@/lib/agents/researcher";
import { BrandProfile, PlannerOutput } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brand, planner, forceDemo } = body as {
      brand: BrandProfile;
      planner: PlannerOutput;
      forceDemo?: boolean;
    };

    if (!brand || !planner) {
      return NextResponse.json(
        { error: "Both brand profile and planner output are required." },
        { status: 400 }
      );
    }

    const result = await runResearcherAgent(brand, planner, forceDemo);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Researcher API Route Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to execute Researcher Agent." },
      { status: 500 }
    );
  }
}
