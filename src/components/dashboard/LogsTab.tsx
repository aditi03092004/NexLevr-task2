import React, { useState } from "react";
import { ToolExecutionLog, AgentName, LogStatus } from "@/lib/types";
import { filterLogs } from "@/lib/utils/logger";
import {
  Terminal,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Clock,
  Eye,
  X,
  Code2,
  Trash2,
} from "lucide-react";

interface LogsTabProps {
  logs: ToolExecutionLog[];
  onClearLogs?: () => void;
}

export const LogsTab: React.FC<LogsTabProps> = ({ logs, onClearLogs }) => {
  const [agentFilter, setAgentFilter] = useState<AgentName | "All">("All");
  const [statusFilter, setStatusFilter] = useState<LogStatus | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState<ToolExecutionLog | null>(null);

  const filtered = filterLogs(logs, agentFilter, statusFilter, searchQuery);

  const successCount = logs.filter((l) => l.status === "SUCCESS").length;
  const warnCount = logs.filter((l) => l.status === "WARNING").length;
  const errCount = logs.filter((l) => l.status === "ERROR").length;
  const totalDurationMs = logs.reduce((acc, l) => acc + (l.durationMs || 0), 0);

  const getStatusBadge = (status: LogStatus) => {
    switch (status) {
      case "SUCCESS":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Success
          </span>
        );
      case "WARNING":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/40">
            <AlertTriangle className="w-3 h-3 text-amber-400" /> Warning
          </span>
        );
      case "ERROR":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-500/40">
            <XCircle className="w-3 h-3 text-rose-400" /> Error
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded-full border border-sky-500/40">
            <Info className="w-3 h-3 text-sky-400" /> Info
          </span>
        );
    }
  };

  const getAgentColor = (agent: AgentName) => {
    switch (agent) {
      case "Planner":
        return "text-violet-400 bg-violet-950/60 border-violet-800/40";
      case "Researcher":
        return "text-sky-400 bg-sky-950/60 border-sky-800/40";
      case "Writer":
        return "text-purple-400 bg-purple-950/60 border-purple-800/40";
      case "Reviewer":
        return "text-emerald-400 bg-emerald-950/60 border-emerald-800/40";
      default:
        return "text-zinc-400 bg-zinc-900 border-zinc-800";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header and Telemetry Metrics */}
      <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-violet-400" />
              Tool-Call Execution Telemetry & Audit Trail
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Deterministic logging of all agent tool invocations, external search queries, latency metrics, and verification steps.
            </p>
          </div>

          {onClearLogs && logs.length > 0 && (
            <button
              onClick={onClearLogs}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Logs
            </button>
          )}
        </div>

        {/* Telemetry Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-zinc-800/80 text-xs">
          <div className="bg-[#0c101d] p-3 rounded-xl border border-zinc-800/60">
            <span className="text-zinc-400 block text-[11px]">Total Tool Calls</span>
            <span className="text-lg font-bold text-white mt-0.5">{logs.length}</span>
          </div>
          <div className="bg-[#0c101d] p-3 rounded-xl border border-zinc-800/60">
            <span className="text-zinc-400 block text-[11px]">Successful Invocations</span>
            <span className="text-lg font-bold text-emerald-400 mt-0.5">{successCount}</span>
          </div>
          <div className="bg-[#0c101d] p-3 rounded-xl border border-zinc-800/60">
            <span className="text-zinc-400 block text-[11px]">Warnings / Errors</span>
            <span className="text-lg font-bold text-amber-400 mt-0.5">
              {warnCount + errCount}
            </span>
          </div>
          <div className="bg-[#0c101d] p-3 rounded-xl border border-zinc-800/60">
            <span className="text-zinc-400 block text-[11px]">Total Agent Compute Time</span>
            <span className="text-lg font-bold text-violet-400 mt-0.5 font-mono">
              {(totalDurationMs / 1000).toFixed(2)}s
            </span>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0d101c] p-3.5 rounded-xl border border-zinc-800 text-xs">
        {/* Agent Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-zinc-400 font-semibold flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-violet-400" /> Agent:
          </span>
          {(["All", "Planner", "Researcher", "Writer", "Reviewer"] as const).map((agent) => (
            <button
              key={agent}
              onClick={() => setAgentFilter(agent)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                agentFilter === agent
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {agent}
            </button>
          ))}
        </div>

        {/* Status Filter & Search */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LogStatus | "All")}
            className="bg-[#121626] text-zinc-300 rounded-lg px-2.5 py-1.5 border border-zinc-700 text-xs focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="WARNING">Warning</option>
            <option value="ERROR">Error</option>
            <option value="INFO">Info</option>
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs..."
              className="bg-[#121626] text-zinc-200 pl-8 pr-3 py-1.5 rounded-lg border border-zinc-700 text-xs focus:outline-none w-36 sm:w-48"
            />
          </div>
        </div>
      </div>

      {/* Logs Table / Cards */}
      {filtered.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-zinc-800 text-center">
          <Terminal className="w-10 h-10 mx-auto text-zinc-600 mb-2" />
          <p className="text-xs text-zinc-400">No tool-call logs match the selected filters.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((log) => (
            <div
              key={log.id}
              className="glass-panel p-4 rounded-xl border border-zinc-800/80 hover:border-violet-500/30 transition-all text-xs space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getAgentColor(
                      log.agentName
                    )}`}
                  >
                    {log.agentName}
                  </span>
                  <span className="font-mono text-zinc-200 font-semibold bg-[#0c101d] px-2 py-0.5 rounded border border-zinc-800">
                    {log.toolName}
                  </span>
                  {getStatusBadge(log.status)}
                </div>

                <div className="flex items-center gap-3 text-[11px] text-zinc-400 shrink-0">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    {log.durationMs}ms
                  </span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                    title="Inspect Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Summary line */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 border-t border-zinc-800/60 text-[11px]">
                <div>
                  <span className="text-zinc-500 font-medium">Input: </span>
                  <span className="text-zinc-300 font-mono">{log.inputSummary}</span>
                </div>
                <div>
                  <span className="text-zinc-500 font-medium">Output: </span>
                  <span className="text-zinc-300">{log.outputSummary}</span>
                </div>
              </div>

              {log.errorMessage && (
                <div className="p-2 rounded bg-rose-950/30 border border-rose-500/30 text-rose-300 text-[11px]">
                  <span className="font-bold">Error:</span> {log.errorMessage}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* JSON Inspection Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-2xl max-h-[85vh] rounded-2xl border border-violet-500/40 p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-bold text-white">
                  Tool-Call Telemetry Details ({selectedLog.id})
                </span>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 overflow-y-auto space-y-4 max-h-[60vh] pr-1">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#0b0e1a] p-2.5 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 text-[10px] uppercase font-semibold">Agent</span>
                  <div className="text-white font-bold">{selectedLog.agentName}</div>
                </div>
                <div className="bg-[#0b0e1a] p-2.5 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 text-[10px] uppercase font-semibold">Tool Invocation</span>
                  <div className="text-white font-mono">{selectedLog.toolName}</div>
                </div>
                <div className="bg-[#0b0e1a] p-2.5 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 text-[10px] uppercase font-semibold">Duration</span>
                  <div className="text-emerald-400 font-mono font-bold">{selectedLog.durationMs}ms</div>
                </div>
                <div className="bg-[#0b0e1a] p-2.5 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 text-[10px] uppercase font-semibold">Timestamp</span>
                  <div className="text-zinc-300 font-mono text-[11px]">{selectedLog.timestamp}</div>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Structured Payload Details (JSON)
                </span>
                <pre className="bg-[#090b14] p-3.5 rounded-xl border border-zinc-800 text-[11px] font-mono text-violet-300 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(selectedLog.details || selectedLog, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
