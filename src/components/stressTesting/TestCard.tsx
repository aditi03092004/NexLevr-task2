import React, { useState } from "react";
import {
  TestCase,
  TestExecutionResult,
  TestStatus,
  VulnerabilitySeverity,
} from "@/lib/stressTesting/types";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Play,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Terminal,
  FileCode,
  Sparkles,
} from "lucide-react";

interface TestCardProps {
  testCase: TestCase;
  result?: TestExecutionResult;
  isRunning: boolean;
  onRunTest: (testId: string) => void;
}

export const TestCard: React.FC<TestCardProps> = ({
  testCase,
  result,
  isRunning,
  onRunTest,
}) => {
  const [expanded, setExpanded] = useState(false);

  const status: TestStatus = isRunning ? "RUNNING" : result ? result.status : "PENDING";

  const getStatusBadge = (s: TestStatus) => {
    switch (s) {
      case "PASSED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Passed
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5 text-rose-400" /> Failed
          </span>
        );
      case "RUNNING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/30 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-violet-400 animate-spin" /> Running...
          </span>
        );
      case "NEEDS_REVIEW":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Needs Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  const getSeverityBadge = (sev: VulnerabilitySeverity) => {
    switch (sev) {
      case "CRITICAL":
        return (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800">
            Critical
          </span>
        );
      case "HIGH":
        return (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-orange-950/80 text-orange-400 border border-orange-800">
            High
          </span>
        );
      case "MEDIUM":
        return (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800">
            Medium
          </span>
        );
      default:
        return (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
            Low
          </span>
        );
    }
  };

  return (
    <div className="bg-[#0e1222] border border-zinc-800/80 hover:border-violet-500/40 rounded-xl overflow-hidden transition-all duration-200">
      {/* Header Summary Row */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="font-mono text-xs font-bold text-violet-400 bg-violet-950/50 px-2 py-0.5 rounded border border-violet-800/60">
              {testCase.id}
            </span>
            {getSeverityBadge(testCase.severity)}
            <span className="text-xs text-zinc-400 font-medium bg-zinc-800/70 px-2 py-0.5 rounded">
              Target: {testCase.targetAgent} Agent
            </span>
            {testCase.cweOrOwaspCategory && (
              <span className="text-[11px] text-zinc-400">
                • {testCase.cweOrOwaspCategory}
              </span>
            )}
          </div>
          <h4 className="text-base font-semibold text-white tracking-tight">{testCase.name}</h4>
          <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{testCase.description}</p>
        </div>

        {/* Action Controls & Status */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
          {getStatusBadge(status)}

          <button
            onClick={() => onRunTest(testCase.id)}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-600/80 hover:bg-violet-600 text-white transition-colors disabled:opacity-50"
            title="Execute this test scenario"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Run
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title={expanded ? "Collapse details" : "Expand details"}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Details Pane */}
      {expanded && (
        <div className="px-4 pb-5 pt-1 border-t border-zinc-800/60 bg-[#090b14]/70 space-y-4 text-xs">
          {/* Expected Behaviour */}
          <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800">
            <span className="font-semibold text-zinc-300 block mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" /> Expected Behaviour:
            </span>
            <p className="text-zinc-400 leading-relaxed">{testCase.expectedBehaviour}</p>
          </div>

          {/* Test Input Payload */}
          <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800">
            <span className="font-semibold text-zinc-300 block mb-1 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-cyan-400" /> Input Payload:
            </span>
            <pre className="text-[11px] font-mono text-zinc-300 bg-black/40 p-2.5 rounded border border-zinc-800/80 overflow-x-auto max-h-40">
              {JSON.stringify(testCase.inputPayload, null, 2)}
            </pre>
          </div>

          {/* Execution Result & Assertions */}
          {result && (
            <>
              {/* Actual Result Summary */}
              <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800">
                <span className="font-semibold text-zinc-300 block mb-1 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Actual Result ({result.durationMs}ms):
                </span>
                <p className="text-zinc-300 leading-relaxed font-mono text-[11px]">
                  {result.actualResult.summary || "Completed execution"}
                </p>
                {Boolean(result.actualResult.rawOutput) && (
                  <pre className="mt-2 text-[11px] font-mono text-zinc-400 bg-black/40 p-2 rounded border border-zinc-800/80 overflow-x-auto max-h-36">
                    {JSON.stringify(result.actualResult.rawOutput, null, 2)}
                  </pre>
                )}
              </div>

              {/* Explicit Assertions Check */}
              <div className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800">
                <span className="font-semibold text-zinc-300 block mb-2">
                  Explicit Assertions ({result.assertions.filter((a) => a.passed).length}/{result.assertions.length} passed):
                </span>
                <div className="space-y-1.5">
                  {result.assertions.map((a) => (
                    <div
                      key={a.id}
                      className={`flex items-start gap-2 p-2 rounded border ${
                        a.passed
                          ? "bg-emerald-950/20 border-emerald-800/30 text-emerald-300"
                          : "bg-rose-950/30 border-rose-800/40 text-rose-300"
                      }`}
                    >
                      {a.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <span className="font-medium text-[11px] block">{a.description}</span>
                        {a.failureReason && (
                          <span className="text-[10px] text-rose-400/90 block mt-0.5">
                            Reason: {a.failureReason}
                          </span>
                        )}
                        {Boolean(a.actualValue) && (
                          <span className="text-[10px] text-zinc-400 block font-mono">
                            Actual: {String(a.actualValue)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vulnerability Explanation & Recommended Fix */}
              {result.status === "FAILED" && (
                <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/50 space-y-2">
                  <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Failure Reason & Root Cause:</span>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    {result.failureExplanation || "Assertion failed"}
                  </p>
                  {result.recommendedFix && (
                    <div className="pt-2 border-t border-rose-900/50">
                      <span className="text-amber-400 font-semibold block mb-0.5">Recommended Fix:</span>
                      <p className="text-zinc-300 text-xs leading-relaxed">{result.recommendedFix}</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
