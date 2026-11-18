// ============================================================================
// Regression Verification Script: Multi-Step Content Agent (Task 1 Workflow)
// ============================================================================

import { runPlannerAgent } from "../agents/planner";
import { runResearcherAgent } from "../agents/researcher";
import { runWriterAgent } from "../agents/writer";
import { runReviewerAgent } from "../agents/reviewer";
import { BrandProfile } from "../types";

export async function verifyTask1Pipeline() {
  console.log("=== STARTING TASK 1 REGRESSION VERIFICATION ===");

  const brand: BrandProfile = {
    id: "brand-test-regression",
    brandName: "CloudPulse Systems",
    brandDescription: "Enterprise observability platform providing real-time distributed tracing.",
    industry: "Enterprise Cloud Infrastructure",
    targetAudience: "DevOps Leaders, Platform Engineers, and CTOs",
    website: "https://cloudpulse.example.com",
    contentGoal: "Thought Leadership & Inbound Product Trials",
    tone: "Authoritative, Visionary & Analytical",
    targetKeywords: ["distributed tracing", "enterprise observability", "cloud telemetry"],
    platforms: ["LinkedIn", "X", "Instagram"],
    language: "English",
    campaignPeriod: "Week 1",
    createdAt: new Date().toISOString(),
  };

  // Step 1: Planner Agent
  console.log("Step 1: Running Planner Agent...");
  const planRes = await runPlannerAgent(brand, true);
  if (!planRes.output.weeklyTheme || !planRes.output.blogTopic) {
    throw new Error("Regression Failure: Planner output missing weeklyTheme or blogTopic");
  }
  console.log(`✓ Planner Agent passed! Theme: "${planRes.output.weeklyTheme}"`);

  // Step 2: Researcher Agent
  console.log("Step 2: Running Researcher Agent...");
  const resRes = await runResearcherAgent(brand, planRes.output, true);
  if (!resRes.output.sources || resRes.output.sources.length === 0) {
    throw new Error("Regression Failure: Researcher output missing sources");
  }
  console.log(`✓ Researcher Agent passed! Retrieved ${resRes.output.sources.length} sources and ${resRes.output.verifiedFacts.length} facts.`);

  // Step 3: Writer Agent
  console.log("Step 3: Running Writer Agent...");
  const writRes = await runWriterAgent(brand, planRes.output, resRes.output, true);
  if (!writRes.output.blog || !writRes.output.socialPosts || !writRes.output.newsletter) {
    throw new Error("Regression Failure: Writer output missing blog, social posts, or newsletter");
  }
  console.log(`✓ Writer Agent passed! Headline: "${writRes.output.blog.headline}", ${writRes.output.socialPosts.length} social posts, 1 newsletter.`);

  // Step 4: Reviewer Agent
  console.log("Step 4: Running Reviewer Agent...");
  const revRes = await runReviewerAgent(brand, planRes.output, resRes.output, writRes.output, true);
  if (!revRes.report.qualityScore || !revRes.report.claims) {
    throw new Error("Regression Failure: Reviewer report missing qualityScore or claims");
  }
  console.log(`✓ Reviewer Agent passed! Quality Score: ${revRes.report.qualityScore}/100, Verdict: ${revRes.report.overallVerdict}.`);

  console.log("=== ALL TASK 1 WORKFLOW REGRESSION CHECKS PASSED PERFECTLY ===");
  return {
    success: true,
    planner: planRes.output.weeklyTheme,
    researcherSources: resRes.output.sources.length,
    blogHeadline: writRes.output.blog.headline,
    qualityScore: revRes.report.qualityScore,
  };
}
