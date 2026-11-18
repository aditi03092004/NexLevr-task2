import React from "react";
import {
  LayoutDashboard,
  Building2,
  BrainCircuit,
  Search,
  PenTool,
  ShieldCheck,
  Terminal,
  Settings,
  PlusCircle,
  FolderOpen,
  Sparkles,
  ChevronRight,
  Flame,
} from "lucide-react";
import { Campaign } from "@/lib/types";

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  campaigns: Campaign[];
  activeCampaignId: string;
  onSelectCampaign: (id: string) => void;
  onNewCampaign: () => void;
  isDemoMode: boolean;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  campaigns,
  activeCampaignId,
  onSelectCampaign,
  onNewCampaign,
  isDemoMode,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, badge: null },
    { id: "brand", label: "Brand Setup", icon: Building2, badge: null },
    { id: "strategy", label: "Content Strategy", icon: BrainCircuit, badge: "Planner" },
    { id: "research", label: "Research", icon: Search, badge: "Researcher" },
    { id: "content", label: "Generated Content", icon: PenTool, badge: "Writer" },
    { id: "reviewer", label: "Reviewer Report", icon: ShieldCheck, badge: "Reviewer" },
    { id: "logs", label: "Tool Execution Logs", icon: Terminal, badge: "Audit" },
    { id: "settings", label: "Settings & API Keys", icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#090b14] border-r border-zinc-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo & Platform Branding */}
          <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-900/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  ContentAgent<span className="text-violet-400">AI</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">
                  Multi-Agent Suite
                </span>
              </div>
            </div>

            {isDemoMode && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3" /> DEMO
              </span>
            )}
          </div>

          {/* Campaign Selector / Switcher */}
          <div className="p-3 border-b border-zinc-800/60 bg-[#0d101d]">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <FolderOpen className="w-3 h-3 text-zinc-500" />
                Active Campaign
              </span>
              <button
                onClick={onNewCampaign}
                className="text-[11px] font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                title="Create New Campaign"
              >
                <PlusCircle className="w-3 h-3" /> New
              </button>
            </div>

            <select
              value={activeCampaignId}
              onChange={(e) => onSelectCampaign(e.target.value)}
              className="w-full text-xs bg-[#13182b] text-zinc-200 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-violet-500 font-medium cursor-pointer"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.brand.brandName || "Untitled Campaign"} ({c.brand.campaignPeriod || "Week 1"})
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-violet-600 text-white shadow-md shadow-violet-900/40"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-400"}`} />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span
                        className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-zinc-800 text-zinc-400 border border-zinc-700/50"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-zinc-800/80 bg-[#070911]">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span>Orchestration:</span>
            <span className="font-semibold text-violet-400">Sequential (4 Agents)</span>
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
            <span>Verification:</span>
            <span className="font-semibold text-emerald-400">Tavily + Gemini</span>
          </div>

          <div className="text-[11px] text-zinc-500 text-center font-mono">
            NexLevr AI Internship v1.0
          </div>
        </div>
      </aside>
    </>
  );
};
