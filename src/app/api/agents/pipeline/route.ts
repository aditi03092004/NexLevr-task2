import { NextRequest, NextResponse } from "next/server";
import { runPlannerAgent } from "@/lib/agents/planner";
import { runResearcherAgent } from "@/lib/agents/researcher";
import { runWriterAgent } from "@/lib/agents/writer";
import { runReviewerAgent } from "@/lib/agents/reviewer";
import {
  BrandProfile,
  Campaign,
  PlannerOutput,
  ResearcherOutput,
  WriterOutput,
  ToolExecutionLog,
} from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      brand,
      forceDemo,
      existingPlanner,
      existingResearcher,
      existingWriter,
      startFrom = "planner",
    } = body as {
      brand: BrandProfile;
      forceDemo?: boolean;
      existingPlanner?: PlannerOutput;
      existingResearcher?: ResearcherOutput;
      existingWriter?: WriterOutput;
      startFrom?: "planner" | "researcher" | "writer" | "reviewer";
    };

    if (!brand || !brand.brandName) {
      return NextResponse.json(
        { error: "Valid brand profile is required." },
        { status: 400 }
      );
    }

    const allLogs: ToolExecutionLog[] = [];
    let plannerOut = existingPlanner;
    let researcherOut = existingResearcher;
    let writerOut = existingWriter;
    let reviewerOut;
    let isDemoFinal = !!forceDemo;

    // Stage 1: Planner Agent
    if (startFrom === "planner" || !plannerOut) {
      const planRes = await runPlannerAgent(brand, forceDemo);
      plannerOut = planRes.output;
      allLogs.push(...planRes.logs);
      if (planRes.isDemo) isDemoFinal = true;
    }

    // Stage 2: Researcher Agent
    if (startFrom === "planner" || startFrom === "researcher" || !researcherOut) {
      if (!plannerOut) throw new Error("Planner output is required to run research.");
      const resRes = await runResearcherAgent(brand, plannerOut, forceDemo);
      researcherOut = resRes.output;
      allLogs.push(...resRes.logs);
      if (resRes.isDemo) isDemoFinal = true;
    }

    // Stage 3: Writer Agent
    if (startFrom === "planner" || startFrom === "researcher" || startFrom === "writer" || !writerOut) {
      if (!plannerOut || !researcherOut) {
        throw new Error("Both planner and researcher outputs are required to write content.");
      }
      const writRes = await runWriterAgent(brand, plannerOut, researcherOut, forceDemo);
      writerOut = writRes.output;
      allLogs.push(...writRes.logs);
      if (writRes.isDemo) isDemoFinal = true;
    }

    // Stage 4: Reviewer Agent
    if (!plannerOut || !researcherOut || !writerOut) {
      throw new Error("All previous stage outputs are required to perform reviewer audit.");
    }
    const revRes = await runReviewerAgent(
      brand,
      plannerOut,
      researcherOut,
      writerOut,
      forceDemo
    );
    reviewerOut = revRes.report;
    allLogs.push(...revRes.logs);
    if (revRes.isDemo) isDemoFinal = true;

    return NextResponse.json({
      planner: plannerOut,
      researcher: researcherOut,
      writer: writerOut,
      reviewer: reviewerOut,
      logs: allLogs,
      isDemo: isDemoFinal,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Pipeline Orchestration Error:", err);
    return NextResponse.json(
      { error: err.message || "Pipeline execution failed." },
      { status: 500 }
    );
  }
}
