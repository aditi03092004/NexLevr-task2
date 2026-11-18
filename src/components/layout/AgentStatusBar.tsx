import React from "react";
import { Campaign, AgentExecutionState, AgentName } from "@/lib/types";
import {
  BrainCircuit,
  Search,
  PenTool,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Clock,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

interface AgentStatusBarProps {
  campaign: Campaign;
  onSelectTab: (tab: string) => void;
  onRetryStage?: (stage: "planner" | "researcher" | "writer" | "reviewer") => void;
  isRunningAny: boolean;
}

export const AgentStatusBar: React.FC<AgentStatusBarProps> = ({
  campaign,
  onSelectTab,
  onRetryStage,
  isRunningAny,
}) => {
  const { agentStatuses } = campaign;

  const agents: Array<{
    id: "planner" | "researcher" | "writer" | "reviewer";
    name: string;
    role: string;
    targetTab: string;
    icon: React.ComponentType<{ className?: string }>;
    status: AgentExecutionState;
    message?: string;
  }> = [
    {
      id: "planner",
      name: "Planner Agent",
      role: "Theme Strategy & Plan",
      targetTab: "strategy",
      icon: BrainCircuit,
      status: agentStatuses.planner.state,
      message: agentStatuses.planner.message,
    },
    {
      id: "researcher",
      name: "Researcher Agent",
      role: "Tavily Web Search & Facts",
      targetTab: "research",
      icon: Search,
      status: agentStatuses.researcher.state,
      message: agentStatuses.researcher.message,
    },
    {
      id: "writer",
      name: "Writer Agent",
      role: "Blog, Social & Newsletter",
      targetTab: "content",
      icon: PenTool,
      status: agentStatuses.writer.state,
      message: agentStatuses.writer.message,
    },
    {
      id: "reviewer",
      name: "Reviewer Agent",
      role: "Fact-Check & Quality Audit",
      targetTab: "reviewer",
      icon: ShieldCheck,
      status: agentStatuses.reviewer.state,
      message: agentStatuses.reviewer.message,
    },
  ];

  const getStatusIcon = (status: AgentExecutionState) => {
    switch (status) {
      case "running":
        return <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      default:
        return <Clock className="w-4 h-4 text-zinc-500" />;
    }
  };

  const getStatusBadge = (status: AgentExecutionState) => {
    switch (status) {
      case "running":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-300 bg-violet-950/80 px-2 py-0.5 rounded-full border border-violet-500/40 animate-pulse">
            Running...
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
            Completed
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-500/40">
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
            Waiting
          </span>
        );
    }
  };

  const getCardBorder = (status: AgentExecutionState) => {
    switch (status) {
      case "running":
        return "border-violet-500/60 shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)] bg-violet-950/20";
      case "completed":
        return "border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/50";
      case "failed":
        return "border-rose-500/50 bg-rose-950/10";
      default:
        return "border-zinc-800/80 bg-[#0d101a]/70 hover:border-zinc-700";
    }
  };

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Multi-Agent Sequential Orchestration
          </span>
          {campaign.isDemoMode && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Demo Archive Active
            </span>
          )}
        </div>
        <span className="text-xs text-zinc-500 font-mono">
          Pipeline: 4 Autonomous Stages
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {agents.map((agent, index) => {
          const Icon = agent.icon;
          const isFailed = agent.status === "failed";
          const isCompleted = agent.status === "completed";

          return (
            <div
              key={agent.id}
              className={`p-3.5 rounded-xl border transition-all duration-200 relative flex flex-col justify-between cursor-pointer ${getCardBorder(
                agent.status
              )}`}
              onClick={() => onSelectTab(agent.targetTab)}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-lg ${
                        agent.status === "running"
                          ? "bg-violet-600 text-white animate-pulse"
                          : agent.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : agent.status === "failed"
                          ? "bg-rose-500/20 text-rose-400"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white leading-tight">
                        {agent.name}
                      </div>
                      <div className="text-[10px] text-zinc-400 leading-tight">
                        Stage {index + 1}
                      </div>
                    </div>
                  </div>

                  {getStatusBadge(agent.status)}
                </div>

                <div className="text-xs text-zinc-300 font-medium line-clamp-1 mb-1">
                  {agent.role}
                </div>

                {agent.message && (
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {agent.message}
                  </p>
                )}
              </div>

              {/* Action bar / retry if failed */}
              <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  {getStatusIcon(agent.status)}
                  <span className="capitalize">{agent.status}</span>
                </div>

                {isFailed && onRetryStage && !isRunningAny && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRetryStage(agent.id);
                    }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-rose-300 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Retry
                  </button>
                )}

                {isCompleted && (
                  <span className="text-[10px] text-violet-400 hover:text-violet-300 font-medium">
                    View Output →
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
