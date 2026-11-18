import { NextRequest, NextResponse } from "next/server";
import { runWriterAgent } from "@/lib/agents/writer";
import { BrandProfile, PlannerOutput, ResearcherOutput } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brand, planner, researcher, forceDemo } = body as {
      brand: BrandProfile;
      planner: PlannerOutput;
      researcher: ResearcherOutput;
      forceDemo?: boolean;
    };

    if (!brand || !planner || !researcher) {
      return NextResponse.json(
        { error: "Brand profile, planner output, and researcher output are all required." },
        { status: 400 }
      );
    }

    const result = await runWriterAgent(brand, planner, researcher, forceDemo);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Writer API Route Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to execute Writer Agent." },
      { status: 500 }
    );
  }
}
