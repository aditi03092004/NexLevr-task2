import React, { useState } from "react";
import { Campaign, ClaimStatus } from "@/lib/types";
import { QualityScoreGauge } from "../agents/QualityScoreGauge";
import { ClaimBadge } from "../agents/ClaimBadge";
import {
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Filter,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Wrench,
} from "lucide-react";

interface ReviewerTabProps {
  campaign: Campaign;
  onRunReviewer: () => void;
  onRegenerateAfterReview: () => void;
  isGenerating: boolean;
}

export const ReviewerTab: React.FC<ReviewerTabProps> = ({
  campaign,
  onRunReviewer,
  onRegenerateAfterReview,
  isGenerating,
}) => {
  const reviewer = campaign.reviewerReport;
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | "ALL">("ALL");

  if (!reviewer) {
    return (
      <div className="glass-panel p-12 rounded-2xl border border-zinc-800 text-center max-w-2xl mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Reviewer Audit Not Yet Performed</h3>
        <p className="text-xs text-zinc-400 mb-6 max-w-md mx-auto">
          The Reviewer Agent acts as an independent adversarial auditor. It extracts every empirical claim,
          cross-examines it against collected primary sources, detects hallucinations, grades brand voice, and flags unsupported statements.
        </p>
        <button
          onClick={onRunReviewer}
          disabled={isGenerating || !campaign.writerOutput}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-lg inline-flex items-center gap-2 ${
            !campaign.writerOutput
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-900/40"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Reviewer Agent</span>
        </button>
        {!campaign.writerOutput && (
          <p className="text-[11px] text-amber-400/80 mt-2">
            * Please generate the Content Package (Writer Agent) first.
          </p>
        )}
      </div>
    );
  }

  const claims = reviewer.claims || [];
  const filteredClaims =
    statusFilter === "ALL"
      ? claims
      : claims.filter((c) => c.status === statusFilter);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Score Gauge */}
      <QualityScoreGauge report={reviewer} />

      {/* Review Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d101c] p-3 rounded-xl border border-zinc-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-semibold flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-violet-400" /> Filter Claims:
          </span>
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              statusFilter === "ALL"
                ? "bg-zinc-700 text-white"
                : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            All ({claims.length})
          </button>
          <button
            onClick={() => setStatusFilter("GREEN")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              statusFilter === "GREEN"
                ? "bg-emerald-900/80 text-emerald-300 border border-emerald-500/40"
                : "bg-zinc-900 text-zinc-400 hover:text-emerald-300"
            }`}
          >
            Supported ({reviewer.supportedClaims})
          </button>
          <button
            onClick={() => setStatusFilter("YELLOW")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              statusFilter === "YELLOW"
                ? "bg-amber-900/80 text-amber-300 border border-amber-500/40"
                : "bg-zinc-900 text-zinc-400 hover:text-amber-300"
            }`}
          >
            Needs Verif. ({reviewer.needsVerificationClaims})
          </button>
          <button
            onClick={() => setStatusFilter("RED")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              statusFilter === "RED"
                ? "bg-rose-900/80 text-rose-300 border border-rose-500/40"
                : "bg-zinc-900 text-zinc-400 hover:text-rose-300"
            }`}
          >
            Unsupported ({reviewer.unsupportedClaims})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRunReviewer}
            disabled={isGenerating}
            className="px-3 py-1.5 rounded-lg font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 transition-colors flex items-center gap-1.5"
            title="Re-run Reviewer Agent"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-audit</span>
          </button>

          <button
            onClick={onRegenerateAfterReview}
            disabled={isGenerating}
            className="px-3.5 py-1.5 rounded-lg font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-colors flex items-center gap-1.5 shadow-md shadow-violet-900/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Regenerate After Review</span>
          </button>
        </div>
      </div>

      {/* Claim-by-Claim Verification Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Identified Factual Claims ({filteredClaims.length})
          </h3>
          <span className="text-[11px] text-zinc-500">
            Adversarial cross-examination vs primary research
          </span>
        </div>

        <div className="space-y-3">
          {filteredClaims.map((claim) => (
            <div
              key={claim.id}
              className={`glass-panel p-4 rounded-xl border transition-all ${
                claim.status === "GREEN"
                  ? "border-emerald-500/20 bg-emerald-950/5"
                  : claim.status === "YELLOW"
                  ? "border-amber-500/30 bg-amber-950/10"
                  : "border-rose-500/40 bg-rose-950/15"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <ClaimBadge status={claim.status} size="sm" />
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                    Location: {claim.contentLocation}
                  </span>
                </div>
              </div>

              {/* Claim statement */}
              <div className="text-sm font-semibold text-white mb-2 leading-snug">
                "{claim.claimText}"
              </div>

              {/* Verification findings */}
              <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                <span className="font-bold text-zinc-400">Audit Finding:</span> {claim.explanation}
              </p>

              {/* Matched Source if Green */}
              {claim.matchedSource && (
                <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                  <span className="text-zinc-400 text-[11px] font-medium">Corroborating Source:</span>
                  <a
                    href={claim.matchedSource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 hover:text-violet-300 flex items-center gap-1 font-semibold"
                  >
                    <span className="truncate max-w-[280px]">{claim.matchedSource.title}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              )}

              {/* Correction suggestion if Yellow or Red */}
              {claim.suggestedCorrection && (
                <div className="mt-2 p-2.5 rounded-lg bg-[#0e1222] border border-amber-500/30 text-xs">
                  <span className="font-bold text-amber-300 block mb-0.5">
                    Suggested Revision / Caveat:
                  </span>
                  <span className="text-zinc-300">{claim.suggestedCorrection}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Editorial Corrections Table */}
      {reviewer.suggestedCorrections && reviewer.suggestedCorrections.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400">
            <Wrench className="w-4 h-4" /> Targeted Line Edits & Tone Corrections
          </div>

          <div className="space-y-3">
            {reviewer.suggestedCorrections.map((corr, idx) => (
              <div
                key={idx}
                className="bg-[#0b0e1b] p-4 rounded-xl border border-zinc-800/80 text-xs space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="font-bold text-violet-300">{corr.target}</span>
                  <span className="italic text-zinc-500">{corr.reason}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20 text-rose-300">
                    <span className="text-[10px] font-bold block text-rose-400 uppercase">Original Draft:</span>
                    "{corr.current}"
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-300">
                    <span className="text-[10px] font-bold block text-emerald-400 uppercase">Suggested Replacement:</span>
                    "{corr.suggested}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Secondary Review Checks: Grammar, Brand Voice, Repetition */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Grammar */}
        <div className="glass-panel p-4 rounded-xl border border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-emerald-400">Readability</span>
            <span className="text-xs font-mono font-bold text-white">
              {reviewer.grammarAndReadability.score}/100
            </span>
          </div>
          <ul className="text-xs text-zinc-300 space-y-1.5">
            {reviewer.grammarAndReadability.feedback.map((f, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Brand Voice */}
        <div className="glass-panel p-4 rounded-xl border border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-violet-400">Brand Voice</span>
            <span className="text-xs font-mono font-bold text-white">
              {reviewer.brandVoiceAdherence.score}/100
            </span>
          </div>
          <ul className="text-xs text-zinc-300 space-y-1.5">
            {reviewer.brandVoiceAdherence.feedback.map((f, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-violet-400 font-bold">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Repetition */}
        <div className="glass-panel p-4 rounded-xl border border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-sky-400">Repetition Check</span>
            <span className="text-xs font-mono font-bold text-white">
              {reviewer.repetitionCheck.hasRepetition ? "Repetitive" : "Passed"}
            </span>
          </div>
          <ul className="text-xs text-zinc-300 space-y-1.5">
            {reviewer.repetitionCheck.findings.map((f, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-sky-400 font-bold">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
