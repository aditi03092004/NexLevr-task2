import React from "react";
import { Campaign } from "@/lib/types";
import { SourceCard } from "../agents/SourceCard";
import {
  Search,
  Globe2,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  Terminal,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

interface ResearchTabProps {
  campaign: Campaign;
  onRunResearcher: () => void;
  onProceedToWriter: () => void;
  isGenerating: boolean;
}

export const ResearchTab: React.FC<ResearchTabProps> = ({
  campaign,
  onRunResearcher,
  onProceedToWriter,
  isGenerating,
}) => {
  const researcher = campaign.researcherOutput;

  if (!researcher) {
    return (
      <div className="glass-panel p-12 rounded-2xl border border-zinc-800 text-center max-w-2xl mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-sky-600/20 text-sky-400 flex items-center justify-center mx-auto mb-4 border border-sky-500/30">
          <Search className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Web Research Not Yet Conducted</h3>
        <p className="text-xs text-zinc-400 mb-6 max-w-md mx-auto">
          The Researcher Agent takes the Planner's strategic questions and queries the Tavily Search API
          to curate real-time empirical sources, verified statistics, and industry benchmarks.
        </p>
        <button
          onClick={onRunResearcher}
          disabled={isGenerating || !campaign.plannerOutput}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-lg inline-flex items-center gap-2 ${
            !campaign.plannerOutput
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              : "bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-sky-900/40"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Researcher Agent</span>
        </button>
        {!campaign.plannerOutput && (
          <p className="text-[11px] text-amber-400/80 mt-2">
            * Please generate the Content Strategy (Planner Agent) first.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Research Summary Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-sky-500/30 relative overflow-hidden bg-gradient-to-br from-[#0e1628] via-[#0b101c] to-[#070911]">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold">
                <Globe2 className="w-3.5 h-3.5" /> Researcher Agent Synthesis
              </span>

              {researcher.isLiveSearch ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                  <CheckCircle2 className="w-3 h-3" /> Live Tavily Index
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-400 border border-amber-500/40">
                  <ShieldAlert className="w-3 h-3" /> Demo Research Archive
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Empirical Research Dossier
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed max-w-3xl">
              {researcher.summary}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onRunResearcher}
              disabled={isGenerating}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 transition-colors flex items-center gap-1.5"
              title="Re-run Live Search"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Re-run Research</span>
            </button>

            <button
              onClick={onProceedToWriter}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 transition-colors flex items-center gap-1.5 shadow-md shadow-violet-900/30"
            >
              <span>Pass to Writer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Research Query Logs */}
        {researcher.queryLog && researcher.queryLog.length > 0 && (
          <div className="mt-5 pt-4 border-t border-zinc-800/80">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              <Terminal className="w-3.5 h-3.5 text-sky-400" /> Search Telemetry & Queries Executed
            </div>
            <div className="flex flex-wrap gap-2">
              {researcher.queryLog.map((log, i) => (
                <span
                  key={i}
                  className="font-mono text-[11px] px-2.5 py-1 rounded bg-[#090d17] border border-zinc-800 text-sky-300"
                >
                  {log}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Verified Empirical Statistics */}
      {researcher.statistics && researcher.statistics.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
            <BarChart3 className="w-4 h-4" /> Extracted Empirical Statistics & Benchmarks
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {researcher.statistics.map((stat, idx) => (
              <div
                key={idx}
                className="bg-[#0b0e1b] p-4 rounded-xl border border-zinc-800/80 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xl font-extrabold text-sky-400 leading-tight mb-1">
                    {stat.statistic}
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                    {stat.context}
                  </p>
                </div>
                <div className="pt-2 border-t border-zinc-800/60 text-[11px]">
                  <a
                    href={stat.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 hover:underline line-clamp-1"
                    title={stat.sourceTitle}
                  >
                    Source: {stat.sourceTitle || "Web"}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verified Facts List */}
      <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <CheckCircle2 className="w-4 h-4" /> Verified Facts & Evidence
        </div>

        <div className="space-y-3">
          {researcher.verifiedFacts.map((fact, idx) => (
            <div
              key={idx}
              className="bg-[#0b0e1a] p-3.5 rounded-xl border border-zinc-800/80 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <p className="text-xs font-medium text-zinc-200 leading-relaxed">
                    {fact.fact}
                  </p>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block mt-1">
                    Category: {fact.category}
                  </span>
                </div>
              </div>

              <a
                href={fact.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-sky-400 hover:text-sky-300 hover:underline shrink-0 font-medium self-end sm:self-center"
              >
                {fact.sourceTitle ? `↗ ${fact.sourceTitle}` : "↗ Source Link"}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Industry Trends */}
      {researcher.industryTrends && researcher.industryTrends.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400">
            <TrendingUp className="w-4 h-4" /> Detected Industry Trends
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {researcher.industryTrends.map((trend, idx) => (
              <div
                key={idx}
                className="bg-[#0c101d] p-3 rounded-lg border border-zinc-800/60 text-xs text-zinc-300 flex items-center gap-2"
              >
                <span className="text-violet-400 font-bold">#</span>
                <span>{trend}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Primary Clickable Sources Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-300">
            <Globe2 className="w-4 h-4 text-violet-400" />
            Primary Online Sources Collected ({researcher.sources.length})
          </div>
          <span className="text-xs text-zinc-500">Click any card to inspect original URL</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {researcher.sources.map((source, index) => (
            <SourceCard key={source.id || index} source={source} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
