import { ToolExecutionLog, AgentName, LogStatus } from "../types";

export function createLogEntry(
  agentName: AgentName,
  toolName: string,
  inputSummary: string,
  outputSummary: string,
  status: LogStatus,
  durationMs: number,
  details?: Record<string, unknown>,
  errorMessage?: string
): ToolExecutionLog {
  return {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    agentName,
    toolName,
    inputSummary,
    outputSummary,
    status,
    durationMs,
    details,
    errorMessage,
  };
}

export function filterLogs(
  logs: ToolExecutionLog[],
  agentFilter?: AgentName | "All",
  statusFilter?: LogStatus | "All",
  searchQuery?: string
): ToolExecutionLog[] {
  return logs.filter((log) => {
    if (agentFilter && agentFilter !== "All" && log.agentName !== agentFilter) {
      return false;
    }
    if (statusFilter && statusFilter !== "All" && log.status !== statusFilter) {
      return false;
    }
    if (searchQuery && searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchInput = log.inputSummary.toLowerCase().includes(q);
      const matchOutput = log.outputSummary.toLowerCase().includes(q);
      const matchTool = log.toolName.toLowerCase().includes(q);
      return matchInput || matchOutput || matchTool;
    }
    return true;
  });
}
