import React from "react";
import { Campaign } from "@/lib/types";
import {
  BrainCircuit,
  Compass,
  Target,
  Users,
  FileText,
  Share2,
  Mail,
  HelpCircle,
  Hash,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface StrategyTabProps {
  campaign: Campaign;
  onRunPlanner: () => void;
  onProceedToResearch: () => void;
  isGenerating: boolean;
}

export const StrategyTab: React.FC<StrategyTabProps> = ({
  campaign,
  onRunPlanner,
  onProceedToResearch,
  isGenerating,
}) => {
  const planner = campaign.plannerOutput;

  if (!planner) {
    return (
      <div className="glass-panel p-12 rounded-2xl border border-zinc-800 text-center max-w-2xl mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-violet-600/20 text-violet-400 flex items-center justify-center mx-auto mb-4 border border-violet-500/30">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Content Strategy Not Yet Generated</h3>
        <p className="text-xs text-zinc-400 mb-6 max-w-md mx-auto">
          The Planner Agent synthesizes your brand profile, audience pain points, and marketing goals
          to architect a cohesive weekly theme, blog angle, social topics, and research targets.
        </p>
        <button
          onClick={onRunPlanner}
          disabled={isGenerating}
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg shadow-violet-900/40 inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Planner Agent</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero: Weekly Theme & Strategic Positioning */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-violet-500/30 relative overflow-hidden bg-gradient-to-br from-[#12162a] via-[#0c0f1c] to-[#080911]">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 text-xs font-semibold mb-3">
              <Compass className="w-3.5 h-3.5" /> Planner Agent Blueprint
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {planner.weeklyTheme}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed max-w-3xl">
              {planner.marketingStrategy}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onRunPlanner}
              disabled={isGenerating}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 transition-colors flex items-center gap-1.5"
              title="Regenerate Strategy"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        {/* Objectives */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
            <Target className="w-3.5 h-3.5 text-violet-400" /> Strategic Content Objectives
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {planner.contentObjectives.map((obj, i) => (
              <div
                key={i}
                className="flex items-start gap-2 bg-[#0e1220] p-2.5 rounded-lg border border-zinc-800/60 text-xs text-zinc-200 font-medium"
              >
                <span className="text-violet-400 font-bold shrink-0">0{i + 1}.</span>
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Target Audience Insights: 3 Columns */}
      <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400">
          <Users className="w-4 h-4" /> Target Audience Intelligence
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pain points */}
          <div className="bg-[#0c101d] p-4 rounded-xl border border-rose-950/40">
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2.5">
              Urgent Pain Points
            </h4>
            <ul className="space-y-2 text-xs text-zinc-300">
              {planner.targetAudienceInsights.problems.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-400/80">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interests */}
          <div className="bg-[#0c101d] p-4 rounded-xl border border-sky-950/40">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2.5">
              Core Technical Interests
            </h4>
            <ul className="space-y-2 text-xs text-zinc-300">
              {planner.targetAudienceInsights.interests.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-sky-400/80">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Motivations */}
          <div className="bg-[#0c101d] p-4 rounded-xl border border-emerald-950/40">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2.5">
              Key Business Motivations
            </h4>
            <ul className="space-y-2 text-xs text-zinc-300">
              {planner.targetAudienceInsights.motivations.map((m, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400/80">•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Topics Roadmap (Blog, Social, Newsletter) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Blog Blueprint */}
        <div className="glass-panel p-5 rounded-xl border border-zinc-800/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
            <FileText className="w-4 h-4" /> Anchor Blog Topic
          </div>
          <h4 className="text-sm font-bold text-white leading-snug">
            {planner.blogTopic.title}
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {planner.blogTopic.angle}
          </p>

          <div className="pt-2 border-t border-zinc-800/60">
            <span className="text-[10px] text-zinc-500 uppercase font-semibold">Keywords:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {planner.blogTopic.targetKeywords.map((k, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Social Posts Roadmap */}
        <div className="glass-panel p-5 rounded-xl border border-zinc-800/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-violet-400 uppercase tracking-wider">
            <Share2 className="w-4 h-4" /> 3 Social Campaign Angles
          </div>
          <div className="space-y-2.5">
            {Object.entries(planner.socialTopics).map(([key, val], idx) => (
              <div key={key} className="bg-[#0c101d] p-2.5 rounded-lg border border-zinc-800/60 text-xs">
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="font-bold text-violet-300">{val.platform}</span>
                  <span className="text-zinc-500 font-mono">Post 0{idx + 1}</span>
                </div>
                <div className="font-semibold text-zinc-200 line-clamp-1">{val.topic}</div>
                <div className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">{val.angle}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Topic */}
        <div className="glass-panel p-5 rounded-xl border border-zinc-800/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
            <Mail className="w-4 h-4" /> Email Newsletter Topic
          </div>
          <div className="text-xs font-bold text-white bg-[#0c101d] p-2.5 rounded-lg border border-zinc-800/60">
            <span className="text-zinc-400 block text-[10px] uppercase">Subject Line Proposal:</span>
            "{planner.newsletterTopic.subjectProposal}"
          </div>
          <p className="text-xs text-zinc-400">
            {planner.newsletterTopic.theme}
          </p>
          <div className="pt-2 border-t border-zinc-800/60">
            <span className="text-[10px] text-zinc-500 uppercase font-semibold">Planned Key Takeaways:</span>
            <ul className="text-xs text-zinc-300 mt-1 space-y-1">
              {planner.newsletterTopic.keyTakeaways.map((t, i) => (
                <li key={i} className="line-clamp-1">• {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Research Questions passed to Researcher */}
      <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <HelpCircle className="w-4 h-4" /> Delegated Research Targets For Researcher Agent
          </div>

          <button
            onClick={onProceedToResearch}
            className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Proceed to Researcher Agent</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs text-zinc-400 mb-3">
          These research targets are systematically queried by the Researcher Agent using the Tavily Search API
          to fetch empirical source citations.
        </p>

        <div className="space-y-2">
          {planner.researchQuestions.map((q, idx) => (
            <div
              key={idx}
              className="bg-[#0b0e1b] p-3 rounded-xl border border-zinc-800/80 flex items-start gap-3 text-xs text-zinc-200"
            >
              <span className="px-2 py-0.5 rounded bg-violet-950 text-violet-400 font-mono text-[11px] font-bold shrink-0">
                Q{idx + 1}
              </span>
              <span className="font-medium">{q}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
