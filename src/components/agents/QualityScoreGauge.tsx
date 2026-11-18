import React from "react";
import { ReviewerReport } from "@/lib/types";
import { ShieldCheck, AlertCircle, XOctagon } from "lucide-react";

interface QualityScoreGaugeProps {
  report: ReviewerReport;
}

export const QualityScoreGauge: React.FC<QualityScoreGaugeProps> = ({ report }) => {
  const { qualityScore, overallVerdict, supportedClaims, needsVerificationClaims, unsupportedClaims, totalClaims } =
    report;

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 75) return "text-violet-400";
    if (score >= 60) return "text-amber-400";
    return "text-rose-400";
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 90) return "bg-gradient-to-r from-emerald-500 to-teal-400";
    if (score >= 75) return "bg-gradient-to-r from-violet-500 to-purple-400";
    if (score >= 60) return "bg-gradient-to-r from-amber-500 to-yellow-400";
    return "bg-gradient-to-r from-rose-500 to-red-400";
  };

  const getVerdictBadge = (verdict: ReviewerReport["overallVerdict"]) => {
    switch (verdict) {
      case "PASSED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" /> Quality Standard Passed
          </span>
        );
      case "PASSED_WITH_WARNINGS":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <AlertCircle className="w-3.5 h-3.5" /> Passed with Cautions
          </span>
        );
      case "NEEDS_REVISION":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <XOctagon className="w-3.5 h-3.5" /> Revision Required
          </span>
        );
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-violet-500/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-wider text-violet-400 font-bold">
              Reviewer Agent Audit
            </span>
            {getVerdictBadge(overallVerdict)}
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Content Quality & Factual Integrity
          </h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">
            {report.qualityScoreRationale}
          </p>
        </div>

        {/* Big Score Box */}
        <div className="flex items-center gap-4 bg-[#0d121f] px-6 py-4 rounded-xl border border-zinc-800 shrink-0">
          <div className="text-right">
            <div className="text-xs text-zinc-400 font-medium">Quality Score</div>
            <div className={`text-4xl font-extrabold ${getScoreColor(qualityScore)}`}>
              {qualityScore}
              <span className="text-lg text-zinc-500 font-normal">/100</span>
            </div>
          </div>
          <div className="h-10 w-px bg-zinc-800" />
          <div className="text-xs text-zinc-400">
            <div><span className="text-emerald-400 font-semibold">{supportedClaims}</span> Supported</div>
            <div><span className="text-amber-400 font-semibold">{needsVerificationClaims}</span> Needs Verif.</div>
            <div><span className="text-rose-400 font-semibold">{unsupportedClaims}</span> Unsupported</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="h-2 w-full bg-zinc-800/80 rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressBarColor(qualityScore)} transition-all duration-700 ease-out`}
            style={{ width: `${Math.min(100, Math.max(0, qualityScore))}%` }}
          />
        </div>
      </div>

      {/* Mini Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-zinc-800/80">
        <div className="bg-[#101422] p-3 rounded-lg border border-zinc-800/60">
          <span className="text-xs text-zinc-400">Total Claims Identified</span>
          <div className="text-lg font-bold text-white mt-0.5">{totalClaims}</div>
        </div>
        <div className="bg-[#101422] p-3 rounded-lg border border-zinc-800/60">
          <span className="text-xs text-zinc-400">Sources Cross-Referenced</span>
          <div className="text-lg font-bold text-white mt-0.5">{report.sourcesChecked}</div>
        </div>
        <div className="bg-[#101422] p-3 rounded-lg border border-zinc-800/60">
          <span className="text-xs text-zinc-400">Readability Score</span>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">
            {report.grammarAndReadability.score}/100
          </div>
        </div>
        <div className="bg-[#101422] p-3 rounded-lg border border-zinc-800/60">
          <span className="text-xs text-zinc-400">Brand Voice Match</span>
          <div className="text-lg font-bold text-violet-400 mt-0.5">
            {report.brandVoiceAdherence.score}/100
          </div>
        </div>
      </div>
    </div>
  );
};
