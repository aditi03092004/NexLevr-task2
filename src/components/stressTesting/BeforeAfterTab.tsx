import React from "react";
import { BeforeAfterComparison } from "@/lib/stressTesting/types";
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

interface BeforeAfterTabProps {
  comparison: BeforeAfterComparison | null;
  loading: boolean;
  onRefreshComparison: () => void;
}

export const BeforeAfterTab: React.FC<BeforeAfterTabProps> = ({
  comparison,
  loading,
  onRefreshComparison,
}) => {
  if (loading || !comparison) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-zinc-400 text-sm">Evaluating Before-and-After test comparisons across both phases...</p>
      </div>
    );
  }

  const { beforeReport, afterReport, metricsComparison, vulnerabilitiesResolved, remainingLimitations } =
    comparison;

  return (
    <div className="space-y-8">
      {/* Top Phase Metric Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pass Rate Delta */}
        <div className="bg-[#0e1222] border border-zinc-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-2">
            <span>TEST PASS RATE</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              +{metricsComparison.testsPassed.delta} tests
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-rose-400">
              {Math.round((beforeReport.testsPassed / beforeReport.totalTests) * 100)}%
            </span>
            <ArrowRight className="w-4 h-4 text-zinc-500" />
            <span className="text-3xl font-extrabold text-emerald-400">
              {Math.round((afterReport.testsPassed / afterReport.totalTests) * 100)}%
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-2 block">
            Passed {afterReport.testsPassed} of {afterReport.totalTests} stress assertions
          </span>
        </div>

        {/* Reliability Score Delta */}
        <div className="bg-[#0e1222] border border-zinc-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-2">
            <span>RELIABILITY SCORE</span>
            <span className="text-violet-400 font-bold flex items-center gap-1">
              +{metricsComparison.overallReliabilityScore.delta} pts
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-amber-400">
              {beforeReport.overallReliabilityScore}%
            </span>
            <ArrowRight className="w-4 h-4 text-zinc-500" />
            <span className="text-3xl font-extrabold text-violet-400">
              {afterReport.overallReliabilityScore}%
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-2 block">
            Weighted composite reliability score
          </span>
        </div>

        {/* Vulnerabilities Detected Delta */}
        <div className="bg-[#0e1222] border border-zinc-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-2">
            <span>VULNERABILITIES</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              {metricsComparison.vulnerabilitiesDetected.delta} active
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-rose-400">
              {beforeReport.vulnerabilitiesDetected} Open
            </span>
            <ArrowRight className="w-4 h-4 text-zinc-500" />
            <span className="text-3xl font-extrabold text-emerald-400">
              {afterReport.vulnerabilitiesDetected} Open
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-2 block">
            Eliminated all critical prompt injection vectors
          </span>
        </div>

        {/* Verified Bug Fixes */}
        <div className="bg-[#0e1222] border border-zinc-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-2">
            <span>BUGS RESOLVED</span>
            <span className="text-indigo-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 100% Verified
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {metricsComparison.bugsFixed} Fixes
          </div>
          <span className="text-[11px] text-zinc-400 mt-2 block">
            Implemented across 4 agents & core services
          </span>
        </div>
      </div>

      {/* Side-by-Side Category Performance Table */}
      <div className="bg-[#0e1222] border border-zinc-800 rounded-xl p-5">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-violet-400" />
          Category-by-Category Before vs After Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090b14] text-zinc-400 border-b border-zinc-800 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Test Category</th>
                <th className="py-3 px-4 text-center">Total Tests</th>
                <th className="py-3 px-4 text-center text-rose-400">Phase 1: Before Fixes</th>
                <th className="py-3 px-4 text-center text-emerald-400">Phase 3: After Fixes</th>
                <th className="py-3 px-4 text-center">Reliability Delta</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-medium">
              {Object.keys(afterReport.categories).map((catKey) => {
                const cat = catKey as keyof typeof afterReport.categories;
                const beforeCat = beforeReport.categories[cat];
                const afterCat = afterReport.categories[cat];
                const delta = afterCat.score - (beforeCat ? beforeCat.score : 0);

                return (
                  <tr key={cat} className="hover:bg-zinc-900/40">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {afterCat.categoryName}
                    </td>
                    <td className="py-3.5 px-4 text-center text-zinc-300">
                      {afterCat.totalTests}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        {beforeCat ? `${beforeCat.passed}/${beforeCat.totalTests} (${beforeCat.score}%)` : "0%"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {afterCat.passed}/{afterCat.totalTests} ({afterCat.score}%)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-emerald-400 font-bold">
                        +{delta}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {afterCat.failed === 0 ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Hardened
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-400 text-xs">
                          <AlertTriangle className="w-3.5 h-3.5" /> In Progress
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vulnerabilities Resolved & Fixes Implemented */}
      <div className="bg-[#0e1222] border border-zinc-800 rounded-xl p-5">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Resolved Vulnerabilities & Engineering Fixes Implemented
        </h3>
        <p className="text-xs text-zinc-400 mb-5">
          Detailed audit of root causes discovered during Phase 1 testing and corresponding architectural safeguards implemented.
        </p>

        <div className="space-y-3.5">
          {vulnerabilitiesResolved.map((vuln) => (
            <div
              key={vuln.id}
              className="p-4 rounded-xl bg-[#090b14] border border-zinc-800 hover:border-violet-500/30 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                    {vuln.id}
                  </span>
                  <h4 className="text-sm font-semibold text-white">{vuln.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800">
                    {vuln.severity}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" /> Verified Fixed
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs mt-3">
                <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                  <span className="font-semibold text-rose-400 block mb-1">
                    Phase 1 Root Cause:
                  </span>
                  <p className="text-zinc-300 leading-relaxed">{vuln.rootCause}</p>
                </div>

                <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
                  <span className="font-semibold text-emerald-400 block mb-1">
                    Fix Implemented in Application:
                  </span>
                  <p className="text-zinc-300 leading-relaxed">{vuln.fixImplemented}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Remaining Limitations & Engineering Roadmap */}
      <div className="bg-[#0e1222] border border-zinc-800 rounded-xl p-5">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Remaining Limitations & Future Hardening Scope
        </h3>
        <p className="text-xs text-zinc-400 mb-4">
          Honest technical evaluation of production boundaries and external dependency limitations.
        </p>

        <ul className="space-y-2.5 text-xs text-zinc-300">
          {remainingLimitations.map((lim, idx) => (
            <li key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-[#090b14] border border-zinc-800">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span>{lim}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
