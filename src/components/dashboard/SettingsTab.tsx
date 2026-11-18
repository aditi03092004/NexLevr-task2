import React, { useState } from "react";
import { ApiKeyStatus, Campaign } from "@/lib/types";
import {
  Settings,
  Key,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  Flame,
  Download,
  Upload,
  CheckCircle2,
  RefreshCw,
  Cpu,
} from "lucide-react";

interface SettingsTabProps {
  keyStatus: ApiKeyStatus;
  onRefreshKeyStatus: () => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  campaigns: Campaign[];
  onImportCampaigns: (campaigns: Campaign[]) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  keyStatus,
  onRefreshKeyStatus,
  isDemoMode,
  onToggleDemoMode,
  campaigns,
  onImportCampaigns,
}) => {
  const [importSuccessNotice, setImportSuccessNotice] = useState(false);

  const handleExportJson = () => {
    const dataStr = JSON.stringify(campaigns, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `content_agent_campaigns_backup_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportCampaigns(parsed);
          setImportSuccessNotice(true);
          setTimeout(() => setImportSuccessNotice(false), 3000);
        }
      } catch (err) {
        alert("Failed to parse JSON file. Ensure it is a valid campaigns export.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Settings Header */}
      <div className="glass-panel p-6 rounded-2xl border border-violet-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-violet-400" /> Platform Configuration & API Environment
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Configure credentials, review AI model connectivity, and manage local storage backups.
              All API keys are securely kept on the server and never exposed to the client.
            </p>
          </div>

          <button
            onClick={onRefreshKeyStatus}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5 text-violet-400" /> Check Status
          </button>
        </div>
      </div>

      {/* API Key Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gemini Card */}
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-bold text-white">Google Gemini API</span>
            </div>
            {keyStatus.hasGeminiKey ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                <ShieldAlert className="w-3.5 h-3.5" /> Key Not Found
              </span>
            )}
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Powers the Planner, Writer, and Reviewer agents. Uses structured JSON mode and system instructions.
          </p>

          <div className="p-3 rounded-lg bg-[#0c101d] border border-zinc-800/80 text-xs space-y-1">
            <div className="flex items-center justify-between text-zinc-400">
              <span>Environment Variable:</span>
              <code className="text-violet-400 font-mono">GEMINI_API_KEY</code>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Active Model:</span>
              <code className="text-emerald-400 font-mono">{keyStatus.geminiModel}</code>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 font-semibold"
            >
              <span>Get Free Gemini API Key at Google AI Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Tavily Card */}
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-sky-400" />
              <span className="text-sm font-bold text-white">Tavily Search API</span>
            </div>
            {keyStatus.hasTavilyKey ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                <ShieldAlert className="w-3.5 h-3.5" /> Key Not Found
              </span>
            )}
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Powers the Researcher Agent to execute live web queries, curate empirical sources, and gather timestamps.
          </p>

          <div className="p-3 rounded-lg bg-[#0c101d] border border-zinc-800/80 text-xs space-y-1">
            <div className="flex items-center justify-between text-zinc-400">
              <span>Environment Variable:</span>
              <code className="text-sky-400 font-mono">TAVILY_API_KEY</code>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Free Quota:</span>
              <span className="text-zinc-300">1,000 Searches / month</span>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="https://tavily.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
            >
              <span>Get Free Tavily Key at Tavily.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Demo Mode Configuration */}
      <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Simulated Demo Mode</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              When enabled or when API keys are absent, all four agents run in a clearly labeled demo mode
              utilizing curated research archives from MIT Sloan, Stanford HAI, and Harvard Business Review.
              Demo results are always transparently flagged as simulated.
            </p>
          </div>

          <button
            onClick={onToggleDemoMode}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 shrink-0 ${
              isDemoMode
                ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-900/30"
                : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
            }`}
          >
            <span>Demo Mode:</span>
            <span className="font-extrabold">{isDemoMode ? "ENABLED" : "DISABLED"}</span>
          </button>
        </div>
      </div>

      {/* Storage & Campaign Data Backup */}
      <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-violet-400 flex items-center gap-2">
          <Download className="w-4 h-4" /> Data Portability & Local Storage
        </h3>

        <p className="text-xs text-zinc-400">
          All campaigns, generated content packs, reviewer reports, and execution logs are stored locally in your browser
          so your work is preserved across refreshes. You can export or import your campaign database anytime.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportJson}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-violet-400" />
            <span>Export Campaign Backup (JSON)</span>
          </button>

          <label className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 transition-colors flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4 text-sky-400" />
            <span>Import Campaign Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>

          {importSuccessNotice && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Campaigns Imported Successfully!
            </span>
          )}
        </div>
      </div>

      {/* Setup Instructions for User */}
      <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          How To Configure Environment Variables
        </h3>
        <p className="text-xs text-zinc-300">
          Create or edit a <code className="text-violet-400 font-mono">.env.local</code> file in your project root with the following keys:
        </p>
        <pre className="bg-[#090b14] p-3.5 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto">
{`GEMINI_API_KEY=AIzaSy...your_gemini_key_here
TAVILY_API_KEY=tvly-...your_tavily_key_here
GEMINI_MODEL=gemini-1.5-flash`}
        </pre>
        <p className="text-[11px] text-zinc-500">
          Restart the Next.js development server after updating your <code className="font-mono">.env.local</code> file.
        </p>
      </div>
    </div>
  );
};
