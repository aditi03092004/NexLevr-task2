import { NextRequest, NextResponse } from "next/server";
import { runPlannerAgent } from "@/lib/agents/planner";
import { BrandProfile } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brand, forceDemo } = body as {
      brand: BrandProfile;
      forceDemo?: boolean;
    };

    if (!brand || !brand.brandName) {
      return NextResponse.json(
        { error: "Invalid brand profile. Brand name is required." },
        { status: 400 }
      );
    }

    const result = await runPlannerAgent(brand, forceDemo);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Planner API Route Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to execute Planner Agent." },
      { status: 500 }
    );
  }
}
