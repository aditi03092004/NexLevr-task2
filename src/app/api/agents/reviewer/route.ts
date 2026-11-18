import { NextRequest, NextResponse } from "next/server";
import { runReviewerAgent } from "@/lib/agents/reviewer";
import {
  BrandProfile,
  PlannerOutput,
  ResearcherOutput,
  WriterOutput,
} from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brand, planner, researcher, writer, forceDemo } = body as {
      brand: BrandProfile;
      planner: PlannerOutput;
      researcher: ResearcherOutput;
      writer: WriterOutput;
      forceDemo?: boolean;
    };

    if (!brand || !planner || !researcher || !writer) {
      return NextResponse.json(
        {
          error:
            "Brand profile, planner output, researcher output, and writer output are all required for review.",
        },
        { status: 400 }
      );
    }

    const result = await runReviewerAgent(brand, planner, researcher, writer, forceDemo);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Reviewer API Route Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to execute Reviewer Agent." },
      { status: 500 }
    );
  }
}
