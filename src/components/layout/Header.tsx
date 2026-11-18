import React from "react";
import { Campaign, ApiKeyStatus } from "@/lib/types";
import {
  Sparkles,
  Download,
  Play,
  Loader2,
  Menu,
  ShieldAlert,
  Flame,
  CheckCircle,
} from "lucide-react";
import { formatCompletePackToMarkdown, triggerDownload } from "@/lib/utils/export";

interface HeaderProps {
  campaign: Campaign;
  keyStatus: ApiKeyStatus;
  isGenerating: boolean;
  onRunFullPipeline: () => void;
  onToggleDemoMode: () => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  campaign,
  keyStatus,
  isGenerating,
  onRunFullPipeline,
  onToggleDemoMode,
  onOpenMobileMenu,
}) => {
  const brandName = campaign.brand.brandName || "Brand Not Set";
  const hasOutput = !!campaign.writerOutput;

  const handleExportMarkdown = () => {
    const md = formatCompletePackToMarkdown(campaign);
    const filename = `${brandName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_content_pack.md`;
    triggerDownload(filename, md, "text/markdown");
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#090b14]/90 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Campaign breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 rounded-lg bg-zinc-800/80 text-zinc-300 hover:text-white lg:hidden"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>{brandName}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-800/50 font-medium hidden sm:inline-block">
                  {campaign.brand.industry || "General"}
                </span>
              </h1>
            </div>
            <div className="text-xs text-zinc-400 hidden sm:block">
              Period: {campaign.brand.campaignPeriod || "Week 1"} • Goal: {campaign.brand.contentGoal || "Awareness"}
            </div>
          </div>
        </div>

        {/* Right: Actions and API key badges */}
        <div className="flex items-center gap-2.5">
          {/* Key status indicator */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            {keyStatus.hasGeminiKey ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium">
                <CheckCircle className="w-3 h-3 text-emerald-400" /> Gemini Live
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-[11px] font-medium">
                <ShieldAlert className="w-3 h-3" /> No Gemini Key
              </span>
            )}

            {keyStatus.hasTavilyKey ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium">
                <CheckCircle className="w-3 h-3 text-emerald-400" /> Tavily Live
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-[11px] font-medium">
                <ShieldAlert className="w-3 h-3" /> No Tavily Key
              </span>
            )}
          </div>

          {/* Demo toggle */}
          <button
            onClick={onToggleDemoMode}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              campaign.isDemoMode
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200"
            }`}
            title="Toggle Demo Archive Simulation"
          >
            <Flame className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Demo Mode:</span>
            <span>{campaign.isDemoMode ? "ON" : "OFF"}</span>
          </button>

          {/* Export button */}
          {hasOutput && (
            <button
              onClick={handleExportMarkdown}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 transition-colors flex items-center gap-1.5"
              title="Download Entire Content Pack as Markdown"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Export Pack</span>
            </button>
          )}

          {/* Primary CTA: Run Full Pipeline */}
          <button
            onClick={onRunFullPipeline}
            disabled={isGenerating}
            className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-lg flex items-center gap-2 ${
              isGenerating
                ? "bg-violet-800/80 cursor-not-allowed opacity-90 shadow-violet-900/30"
                : "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-violet-600/30 active:scale-95"
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Agents Working...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Content Pack</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
