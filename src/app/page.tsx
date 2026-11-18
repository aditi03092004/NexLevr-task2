"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Campaign,
  ApiKeyStatus,
  BrandProfile,
  PlannerOutput,
  ResearcherOutput,
  WriterOutput,
  ReviewerReport,
  ToolExecutionLog,
} from "@/lib/types";
import {
  getStoredCampaigns,
  saveSingleCampaign,
  createNewCampaign,
  getActiveCampaignId,
  setActiveCampaignId,
  saveCampaigns,
} from "@/lib/storage/campaignStore";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AgentStatusBar } from "@/components/layout/AgentStatusBar";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { BrandSetupTab } from "@/components/dashboard/BrandSetupTab";
import { StrategyTab } from "@/components/dashboard/StrategyTab";
import { ResearchTab } from "@/components/dashboard/ResearchTab";
import { ContentTab } from "@/components/dashboard/ContentTab";
import { ReviewerTab } from "@/components/dashboard/ReviewerTab";
import { LogsTab } from "@/components/dashboard/LogsTab";
import { SettingsTab } from "@/components/dashboard/SettingsTab";

const DEFAULT_BRAND: BrandProfile = {
  id: "brand-default",
  brandName: "AgentScale AI",
  brandDescription:
    "Enterprise multi-agent automation platform that coordinates planning, retrieval, and verification to eliminate repetitive operational workflows.",
  industry: "Artificial Intelligence & Enterprise SaaS",
  targetAudience: "VPs of Engineering, CTOs, and Operations Leaders at mid-to-large companies",
  website: "https://agentscale.ai",
  contentGoal: "Thought Leadership & Inbound Enterprise Demos",
  tone: "Authoritative, Visionary & Analytical",
  targetKeywords: ["AI agent workflows", "multi-step orchestration", "hallucination reduction", "enterprise automation"],
  platforms: ["LinkedIn", "X", "Instagram"],
  language: "English",
  campaignPeriod: "Week 1 - Scaling Automation",
  createdAt: new Date().toISOString(),
};

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaignId, setActiveCampaignIdState] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [keyStatus, setKeyStatus] = useState<ApiKeyStatus>({
    hasGeminiKey: false,
    hasTavilyKey: false,
    geminiModel: "gemini-1.5-flash",
    demoModeAvailable: true,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentRunningStage, setCurrentRunningStage] = useState<string | null>(null);

  // Fetch API Key status from server
  const checkKeys = useCallback(async () => {
    try {
      const res = await fetch("/api/check-keys");
      if (res.ok) {
        const data = await res.json();
        setKeyStatus(data);
        return data;
      }
    } catch (err) {
      console.error("Failed to check API keys status", err);
    }
    return null;
  }, []);

  // Initialize campaigns from LocalStorage
  useEffect(() => {
    checkKeys();
    const loaded = getStoredCampaigns();
    if (loaded.length > 0) {
      setCampaigns(loaded);
      const savedActiveId = getActiveCampaignId();
      if (savedActiveId && loaded.some((c) => c.id === savedActiveId)) {
        setActiveCampaignIdState(savedActiveId);
      } else {
        setActiveCampaignIdState(loaded[0].id);
      }
    } else {
      // Create initial sample campaign
      const initial = createNewCampaign(DEFAULT_BRAND, false);
      setCampaigns([initial]);
      setActiveCampaignIdState(initial.id);
      saveSingleCampaign(initial);
    }
  }, [checkKeys]);

  const activeCampaign =
    campaigns.find((c) => c.id === activeCampaignId) || campaigns[0];

  const updateActiveCampaign = useCallback(
    (updater: (prev: Campaign) => Campaign) => {
      setCampaigns((prev) => {
        const index = prev.findIndex((c) => c.id === activeCampaignId);
        if (index === -1) return prev;
        const updated = updater(prev[index]);
        const nextList = [...prev];
        nextList[index] = updated;
        saveSingleCampaign(updated);
        return nextList;
      });
    },
    [activeCampaignId]
  );

  const handleSelectCampaign = (id: string) => {
    setActiveCampaignIdState(id);
    setActiveCampaignId(id);
  };

  const handleNewCampaign = () => {
    const brandCopy = {
      ...DEFAULT_BRAND,
      id: `brand-${Date.now()}`,
      brandName: "New Brand Campaign",
      campaignPeriod: `Week ${campaigns.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    const newCamp = createNewCampaign(brandCopy, !keyStatus.hasGeminiKey);
    const updated = [newCamp, ...campaigns];
    setCampaigns(updated);
    setActiveCampaignIdState(newCamp.id);
    saveSingleCampaign(newCamp);
    setActiveTab("brand");
  };

  const handleToggleDemoMode = () => {
    if (!activeCampaign) return;
    updateActiveCampaign((prev) => ({
      ...prev,
      isDemoMode: !prev.isDemoMode,
    }));
  };

  // Run a single agent stage (or retry)
  const runStage = async (stage: "planner" | "researcher" | "writer" | "reviewer") => {
    if (!activeCampaign || isGenerating) return;
    setIsGenerating(true);
    setCurrentRunningStage(stage);

    const isDemo = activeCampaign.isDemoMode || !keyStatus.hasGeminiKey;

    try {
      if (stage === "planner") {
        updateActiveCampaign((prev) => ({
          ...prev,
          agentStatuses: {
            ...prev.agentStatuses,
            planner: { state: "running", message: "Analyzing audience & marketing objectives..." },
          },
        }));

        const res = await fetch("/api/agents/planner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brand: activeCampaign.brand, forceDemo: isDemo }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Planner agent execution failed.");
        }

        const data: { output: PlannerOutput; logs: ToolExecutionLog[]; isDemo: boolean } =
          await res.json();

        updateActiveCampaign((prev) => ({
          ...prev,
          plannerOutput: data.output,
          agentStatuses: {
            ...prev.agentStatuses,
            planner: { state: "completed", message: `Planned theme: "${data.output.weeklyTheme}"` },
          },
          logs: [...data.logs, ...prev.logs],
        }));
      } else if (stage === "researcher") {
        if (!activeCampaign.plannerOutput) {
          throw new Error("Planner output is required before executing Researcher Agent.");
        }

        updateActiveCampaign((prev) => ({
          ...prev,
          agentStatuses: {
            ...prev.agentStatuses,
            researcher: { state: "running", message: "Querying Tavily index for empirical facts..." },
          },
        }));

        const res = await fetch("/api/agents/researcher", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            brand: activeCampaign.brand,
            planner: activeCampaign.plannerOutput,
            forceDemo: isDemo,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Researcher agent execution failed.");
        }

        const data: { output: ResearcherOutput; logs: ToolExecutionLog[]; isDemo: boolean } =
          await res.json();

        updateActiveCampaign((prev) => ({
          ...prev,
          researcherOutput: data.output,
          agentStatuses: {
            ...prev.agentStatuses,
            researcher: {
              state: "completed",
              message: `Retrieved ${data.output.sources.length} sources and ${data.output.statistics.length} statistics.`,
            },
          },
          logs: [...data.logs, ...prev.logs],
        }));
      } else if (stage === "writer") {
        if (!activeCampaign.plannerOutput || !activeCampaign.researcherOutput) {
          throw new Error("Both Planner and Researcher outputs are required before drafting.");
        }

        updateActiveCampaign((prev) => ({
          ...prev,
          agentStatuses: {
            ...prev.agentStatuses,
            writer: { state: "running", message: "Drafting blog, 3 social posts, and newsletter..." },
          },
        }));

        const res = await fetch("/api/agents/writer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            brand: activeCampaign.brand,
            planner: activeCampaign.plannerOutput,
            researcher: activeCampaign.researcherOutput,
            forceDemo: isDemo,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Writer agent execution failed.");
        }

        const data: { output: WriterOutput; logs: ToolExecutionLog[]; isDemo: boolean } =
          await res.json();

        updateActiveCampaign((prev) => ({
          ...prev,
          writerOutput: data.output,
          agentStatuses: {
            ...prev.agentStatuses,
            writer: {
              state: "completed",
              message: `Generated Blog ("${data.output.blog.headline}"), 3 posts & newsletter.`,
            },
          },
          logs: [...data.logs, ...prev.logs],
        }));
      } else if (stage === "reviewer") {
        if (
          !activeCampaign.plannerOutput ||
          !activeCampaign.researcherOutput ||
          !activeCampaign.writerOutput
        ) {
          throw new Error("All previous agent outputs are required before Reviewer audit.");
        }

        updateActiveCampaign((prev) => ({
          ...prev,
          agentStatuses: {
            ...prev.agentStatuses,
            reviewer: { state: "running", message: "Cross-examining claims vs collected research..." },
          },
        }));

        const res = await fetch("/api/agents/reviewer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            brand: activeCampaign.brand,
            planner: activeCampaign.plannerOutput,
            researcher: activeCampaign.researcherOutput,
            writer: activeCampaign.writerOutput,
            forceDemo: isDemo,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Reviewer agent audit failed.");
        }

        const data: { report: ReviewerReport; logs: ToolExecutionLog[]; isDemo: boolean } =
          await res.json();

        updateActiveCampaign((prev) => ({
          ...prev,
          reviewerReport: data.report,
          agentStatuses: {
            ...prev.agentStatuses,
            reviewer: {
              state: "completed",
              message: `Audit Score: ${data.report.qualityScore}/100. ${data.report.supportedClaims} Supported claims.`,
            },
          },
          logs: [...data.logs, ...prev.logs],
        }));
      }
    } catch (err: unknown) {
      const error = err as Error;
      updateActiveCampaign((prev) => ({
        ...prev,
        agentStatuses: {
          ...prev.agentStatuses,
          [stage]: { state: "failed", message: error.message },
        },
      }));
      alert(`Agent execution failed in ${stage}: ${error.message}`);
    } finally {
      setIsGenerating(false);
      setCurrentRunningStage(null);
    }
  };

  // Run full sequential pipeline: Planner -> Researcher -> Writer -> Reviewer
  const handleRunFullPipeline = async () => {
    if (!activeCampaign || isGenerating) return;
    setIsGenerating(true);

    const isDemo = activeCampaign.isDemoMode || !keyStatus.hasGeminiKey;

    try {
      // 1. Planner Stage
      setCurrentRunningStage("planner");
      updateActiveCampaign((prev) => ({
        ...prev,
        agentStatuses: {
          planner: { state: "running", message: "Analyzing brand & crafting content strategy..." },
          researcher: { state: "waiting", message: "Awaiting planner output..." },
          writer: { state: "waiting", message: "Awaiting research sources..." },
          reviewer: { state: "waiting", message: "Awaiting generated drafts..." },
        },
      }));

      const planRes = await fetch("/api/agents/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: activeCampaign.brand, forceDemo: isDemo }),
      });
      if (!planRes.ok) {
        const err = await planRes.json();
        throw new Error(err.error || "Planner stage failed.");
      }
      const planData: { output: PlannerOutput; logs: ToolExecutionLog[] } = await planRes.json();

      updateActiveCampaign((prev) => ({
        ...prev,
        plannerOutput: planData.output,
        agentStatuses: {
          ...prev.agentStatuses,
          planner: { state: "completed", message: `Theme: "${planData.output.weeklyTheme}"` },
        },
        logs: [...planData.logs, ...prev.logs],
      }));

      // 2. Researcher Stage
      setCurrentRunningStage("researcher");
      updateActiveCampaign((prev) => ({
        ...prev,
        agentStatuses: {
          ...prev.agentStatuses,
          researcher: { state: "running", message: "Executing live Tavily search queries..." },
        },
      }));

      const resRes = await fetch("/api/agents/researcher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: activeCampaign.brand,
          planner: planData.output,
          forceDemo: isDemo,
        }),
      });
      if (!resRes.ok) {
        const err = await resRes.json();
        throw new Error(err.error || "Researcher stage failed.");
      }
      const resData: { output: ResearcherOutput; logs: ToolExecutionLog[] } = await resRes.json();

      updateActiveCampaign((prev) => ({
        ...prev,
        researcherOutput: resData.output,
        agentStatuses: {
          ...prev.agentStatuses,
          researcher: {
            state: "completed",
            message: `Retrieved ${resData.output.sources.length} sources and ${resData.output.statistics.length} statistics.`,
          },
        },
        logs: [...resData.logs, ...prev.logs],
      }));

      // 3. Writer Stage
      setCurrentRunningStage("writer");
      updateActiveCampaign((prev) => ({
        ...prev,
        agentStatuses: {
          ...prev.agentStatuses,
          writer: { state: "running", message: "Synthesizing research into blog, social & newsletter..." },
        },
      }));

      const writRes = await fetch("/api/agents/writer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: activeCampaign.brand,
          planner: planData.output,
          researcher: resData.output,
          forceDemo: isDemo,
        }),
      });
      if (!writRes.ok) {
        const err = await writRes.json();
        throw new Error(err.error || "Writer stage failed.");
      }
      const writData: { output: WriterOutput; logs: ToolExecutionLog[] } = await writRes.json();

      updateActiveCampaign((prev) => ({
        ...prev,
        writerOutput: writData.output,
        agentStatuses: {
          ...prev.agentStatuses,
          writer: {
            state: "completed",
            message: `Created Blog, 3 Social Posts & Email Newsletter.`,
          },
        },
        logs: [...writData.logs, ...prev.logs],
      }));

      // 4. Reviewer Stage
      setCurrentRunningStage("reviewer");
      updateActiveCampaign((prev) => ({
        ...prev,
        agentStatuses: {
          ...prev.agentStatuses,
          reviewer: { state: "running", message: "Fact-checking claims against source documents..." },
        },
      }));

      const revRes = await fetch("/api/agents/reviewer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: activeCampaign.brand,
          planner: planData.output,
          researcher: resData.output,
          writer: writData.output,
          forceDemo: isDemo,
        }),
      });
      if (!revRes.ok) {
        const err = await revRes.json();
        throw new Error(err.error || "Reviewer audit stage failed.");
      }
      const revData: { report: ReviewerReport; logs: ToolExecutionLog[] } = await revRes.json();

      updateActiveCampaign((prev) => ({
        ...prev,
        reviewerReport: revData.report,
        agentStatuses: {
          ...prev.agentStatuses,
          reviewer: {
            state: "completed",
            message: `Audit Score: ${revData.report.qualityScore}/100. Verdict: ${revData.report.overallVerdict}.`,
          },
        },
        logs: [...revData.logs, ...prev.logs],
      }));

      // Automatically navigate to Reviewer tab to inspect findings
      setActiveTab("reviewer");
    } catch (err: unknown) {
      const error = err as Error;
      if (currentRunningStage) {
        updateActiveCampaign((prev) => ({
          ...prev,
          agentStatuses: {
            ...prev.agentStatuses,
            [currentRunningStage]: { state: "failed", message: error.message },
          },
        }));
      }
      alert(`Pipeline error: ${error.message}`);
    } finally {
      setIsGenerating(false);
      setCurrentRunningStage(null);
    }
  };

  // Regenerate content after review
  const handleRegenerateAfterReview = async () => {
    if (!activeCampaign || !activeCampaign.plannerOutput || !activeCampaign.researcherOutput) return;
    await runStage("writer");
    await runStage("reviewer");
    setActiveTab("reviewer");
  };

  if (!activeCampaign) {
    return (
      <div className="min-h-screen bg-[#07080d] flex items-center justify-center text-zinc-400">
        Loading Multi-Agent System...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080d] text-zinc-100 flex flex-col">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        campaigns={campaigns}
        activeCampaignId={activeCampaignId}
        onSelectCampaign={handleSelectCampaign}
        onNewCampaign={handleNewCampaign}
        isDemoMode={activeCampaign.isDemoMode}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Pane */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        <Header
          campaign={activeCampaign}
          keyStatus={keyStatus}
          isGenerating={isGenerating}
          onRunFullPipeline={handleRunFullPipeline}
          onToggleDemoMode={handleToggleDemoMode}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl mx-auto w-full">
          {/* Top Sequential Agent Status Stepper */}
          <AgentStatusBar
            campaign={activeCampaign}
            onSelectTab={setActiveTab}
            onRetryStage={runStage}
            isRunningAny={isGenerating}
          />

          {/* Active Tab View */}
          {activeTab === "overview" && (
            <OverviewTab
              campaign={activeCampaign}
              campaigns={campaigns}
              keyStatus={keyStatus}
              onSelectTab={setActiveTab}
              onRunFullPipeline={handleRunFullPipeline}
              isGenerating={isGenerating}
            />
          )}

          {activeTab === "brand" && (
            <BrandSetupTab
              brand={activeCampaign.brand}
              onUpdateBrand={(updated) =>
                updateActiveCampaign((prev) => ({
                  ...prev,
                  brand: updated,
                }))
              }
              onStartPipeline={handleRunFullPipeline}
              isGenerating={isGenerating}
            />
          )}

          {activeTab === "strategy" && (
            <StrategyTab
              campaign={activeCampaign}
              onRunPlanner={() => runStage("planner")}
              onProceedToResearch={() => {
                setActiveTab("research");
                if (!activeCampaign.researcherOutput) {
                  runStage("researcher");
                }
              }}
              isGenerating={isGenerating}
            />
          )}

          {activeTab === "research" && (
            <ResearchTab
              campaign={activeCampaign}
              onRunResearcher={() => runStage("researcher")}
              onProceedToWriter={() => {
                setActiveTab("content");
                if (!activeCampaign.writerOutput) {
                  runStage("writer");
                }
              }}
              isGenerating={isGenerating}
            />
          )}

          {activeTab === "content" && (
            <ContentTab
              campaign={activeCampaign}
              onUpdateWriterOutput={(updated) =>
                updateActiveCampaign((prev) => ({
                  ...prev,
                  writerOutput: updated,
                }))
              }
              onRunWriter={() => runStage("writer")}
              onProceedToReviewer={() => {
                setActiveTab("reviewer");
                if (!activeCampaign.reviewerReport) {
                  runStage("reviewer");
                }
              }}
              isGenerating={isGenerating}
            />
          )}

          {activeTab === "reviewer" && (
            <ReviewerTab
              campaign={activeCampaign}
              onRunReviewer={() => runStage("reviewer")}
              onRegenerateAfterReview={handleRegenerateAfterReview}
              isGenerating={isGenerating}
            />
          )}

          {activeTab === "logs" && (
            <LogsTab
              logs={activeCampaign.logs}
              onClearLogs={() =>
                updateActiveCampaign((prev) => ({
                  ...prev,
                  logs: [],
                }))
              }
            />
          )}

          {activeTab === "settings" && (
            <SettingsTab
              keyStatus={keyStatus}
              onRefreshKeyStatus={checkKeys}
              isDemoMode={activeCampaign.isDemoMode}
              onToggleDemoMode={handleToggleDemoMode}
              campaigns={campaigns}
              onImportCampaigns={(imported) => {
                setCampaigns(imported);
                if (imported.length > 0) {
                  setActiveCampaignIdState(imported[0].id);
                  saveCampaigns(imported);
                }
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
