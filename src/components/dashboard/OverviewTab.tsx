import React from "react";
import { Campaign, ApiKeyStatus } from "@/lib/types";
import {
  FolderKanban,
  CheckCircle2,
  Globe2,
  FileText,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  BrainCircuit,
  Search,
  PenTool,
  Clock,
  Terminal,
} from "lucide-react";

interface OverviewTabProps {
  campaign: Campaign;
  campaigns: Campaign[];
  keyStatus: ApiKeyStatus;
  onSelectTab: (tab: string) => void;
  onRunFullPipeline: () => void;
  isGenerating: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  campaign,
  campaigns,
  keyStatus,
  onSelectTab,
  onRunFullPipeline,
  isGenerating,
}) => {
  // Compute aggregate stats across campaigns
  const totalCampaigns = campaigns.length;
  const completedCampaigns = campaigns.filter(
    (c) => c.agentStatuses.reviewer.state === "completed"
  ).length;

  const totalSourcesCollected = campaigns.reduce(
    (acc, c) => acc + (c.researcherOutput?.sources?.length || 0),
    0
  );

  const totalContentPieces = campaigns.reduce((acc, c) => {
    let count = 0;
    if (c.writerOutput?.blog) count += 1;
    if (c.writerOutput?.socialPosts) count += c.writerOutput.socialPosts.length;
    if (c.writerOutput?.newsletter) count += 1;
    return acc + count;
  }, 0);

  const totalReviewerIssues = campaigns.reduce(
    (acc, c) => acc + (c.reviewerReport?.needsVerificationClaims || 0) + (c.reviewerReport?.unsupportedClaims || 0),
    0
  );

  const hasStrategy = !!campaign.plannerOutput;
  const hasResearch = !!campaign.researcherOutput;
  const hasContent = !!campaign.writerOutput;
  const hasReview = !!campaign.reviewerReport;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-950/70 via-[#101426] to-[#0c0f1c] border border-violet-500/30 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Autonomous Multi-Agent Suite
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            AI Multi-Step Content & Factual Verification Engine
          </h2>

          <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
            Four specialized autonomous agents collaborate to research, plan, write, and rigorously
            fact-check complete weekly content packages for{" "}
            <span className="text-white font-semibold">{campaign.brand.brandName || "your brand"}</span>.
            Every claim is cross-checked against credible web sources.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={onRunFullPipeline}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg shadow-violet-900/40 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? "Executing Pipeline..." : "Generate Content Pack"}</span>
            </button>

            <button
              onClick={() => onSelectTab("brand")}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-zinc-200 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 transition-all flex items-center gap-2"
            >
              <span>Edit Brand Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <div className="glass-panel p-4 rounded-xl border border-zinc-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Total Campaigns</span>
            <FolderKanban className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{totalCampaigns}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Saved in LocalStorage</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-zinc-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Completed Runs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-400">{completedCampaigns}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">End-to-end verified</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-zinc-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Web Sources</span>
            <Globe2 className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-sky-400">{totalSourcesCollected}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Retrieved via Tavily</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-zinc-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Pieces Generated</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-purple-400">{totalContentPieces}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Blogs, Posts & Emails</div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-zinc-800/80 flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Flagged Claims</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-amber-400">{totalReviewerIssues}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Reviewer warnings</div>
          </div>
        </div>
      </div>

      {/* Active Campaign Status Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Pipeline Stage Cards */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Current Campaign Deliverables
            </h3>
            <span className="text-xs text-zinc-400 font-mono">
              Campaign ID: {campaign.id.substring(0, 14)}...
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Planner Card */}
            <div
              onClick={() => onSelectTab("strategy")}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                hasStrategy
                  ? "bg-[#0d121f] border-violet-500/30 hover:border-violet-500/60"
                  : "bg-zinc-950/40 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-violet-400 font-semibold text-xs">
                  <BrainCircuit className="w-4 h-4" />
                  <span>Content Strategy</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    hasStrategy
                      ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {hasStrategy ? "Ready" : "Pending"}
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-medium line-clamp-2">
                {campaign.plannerOutput?.weeklyTheme || "Awaiting strategy generation..."}
              </p>
              <div className="mt-3 text-[11px] text-violet-400 flex items-center gap-1 font-semibold">
                <span>View Strategy Plan</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Researcher Card */}
            <div
              onClick={() => onSelectTab("research")}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                hasResearch
                  ? "bg-[#0d121f] border-sky-500/30 hover:border-sky-500/60"
                  : "bg-zinc-950/40 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs">
                  <Search className="w-4 h-4" />
                  <span>Live Web Research</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    hasResearch
                      ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {hasResearch ? `${campaign.researcherOutput?.sources.length} Sources` : "Pending"}
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-medium line-clamp-2">
                {campaign.researcherOutput?.summary || "Awaiting live web retrieval..."}
              </p>
              <div className="mt-3 text-[11px] text-sky-400 flex items-center gap-1 font-semibold">
                <span>Inspect Sources & Stats</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Writer Card */}
            <div
              onClick={() => onSelectTab("content")}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                hasContent
                  ? "bg-[#0d121f] border-purple-500/30 hover:border-purple-500/60"
                  : "bg-zinc-950/40 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs">
                  <PenTool className="w-4 h-4" />
                  <span>Generated Package</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    hasContent
                      ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {hasContent ? "1 Blog + 3 Posts + Newsletter" : "Pending"}
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-medium line-clamp-2">
                {campaign.writerOutput?.blog.headline || "Awaiting drafting by Writer Agent..."}
              </p>
              <div className="mt-3 text-[11px] text-purple-400 flex items-center gap-1 font-semibold">
                <span>View & Edit Content</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Reviewer Card */}
            <div
              onClick={() => onSelectTab("reviewer")}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                hasReview
                  ? "bg-[#0d121f] border-emerald-500/30 hover:border-emerald-500/60"
                  : "bg-zinc-950/40 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Reviewer Audit</span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    hasReview
                      ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {hasReview ? `${campaign.reviewerReport?.qualityScore}/100` : "Pending"}
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-medium line-clamp-2">
                {campaign.reviewerReport?.qualityScoreRationale || "Awaiting factual claim audit..."}
              </p>
              <div className="mt-3 text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                <span>Review Fact Checks</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Recent Activity & Audit Logs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-400" /> Recent Activity
            </h3>
            <button
              onClick={() => onSelectTab("logs")}
              className="text-xs text-violet-400 hover:text-violet-300 font-semibold"
            >
              All Logs →
            </button>
          </div>

          <div className="glass-panel rounded-xl p-4 border border-zinc-800/80 space-y-3 max-h-[320px] overflow-y-auto">
            {campaign.logs && campaign.logs.length > 0 ? (
              campaign.logs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-lg bg-[#0e1220] border border-zinc-800/60 text-xs"
                >
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                    <span className="font-semibold text-violet-400">{log.agentName}</span>
                    <span className="font-mono">{log.durationMs}ms</span>
                  </div>
                  <div className="text-zinc-200 font-medium line-clamp-1">{log.toolName}</div>
                  <div className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">
                    {log.outputSummary}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-zinc-500">
                <Terminal className="w-8 h-8 mx-auto mb-2 text-zinc-600 opacity-60" />
                No execution logs recorded yet. Run the pipeline to view real-time agent telemetry.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
