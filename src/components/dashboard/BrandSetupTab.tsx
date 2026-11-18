import React, { useState } from "react";
import { BrandProfile, Platform } from "@/lib/types";
import {
  Building2,
  Globe,
  Target,
  Sparkles,
  Sliders,
  Hash,
  Share2,
  Calendar,
  Languages,
  Check,
  Zap,
} from "lucide-react";

interface BrandSetupTabProps {
  brand: BrandProfile;
  onUpdateBrand: (updated: BrandProfile) => void;
  onStartPipeline: () => void;
  isGenerating: boolean;
}

const PRESET_TEMPLATES: Array<{
  name: string;
  data: Partial<BrandProfile>;
}> = [
  {
    name: "🚀 B2B AI Workflow Platform",
    data: {
      brandName: "AgentScale AI",
      brandDescription:
        "Enterprise multi-agent automation platform that coordinates planning, retrieval, and verification to eliminate repetitive operational workflows.",
      industry: "Artificial Intelligence & Enterprise SaaS",
      targetAudience: "VPs of Engineering, CTOs, and Operations Leaders at mid-to-large companies",
      website: "https://agentscale.ai",
      contentGoal: "Thought Leadership & Inbound Enterprise Demos",
      tone: "Authoritative, Visionary & Analytical",
      targetKeywords: ["AI agent workflows", "multi-step orchestration", "hallucination reduction", "enterprise automation"],
      platforms: ["LinkedIn", "X", "Instagram"],
      language: "English",
      campaignPeriod: "Week 1 - Scaling Automation",
    },
  },
  {
    name: "🌿 Sustainable Eco-Commerce",
    data: {
      brandName: "Verde Living",
      brandDescription:
        "Direct-to-consumer sustainable home essentials and zero-waste lifestyle brand utilizing certified circular supply chains.",
      industry: "Eco-Friendly Consumer Goods",
      targetAudience: "Eco-conscious millennials and modern homeowners seeking certified low-carbon living solutions",
      website: "https://verdeliving.co",
      contentGoal: "Brand Awareness & Community Education",
      tone: "Conversational, Inspiring & Authentic",
      targetKeywords: ["zero waste home", "circular economy", "plastic free living", "sustainable consumer goods"],
      platforms: ["Instagram", "LinkedIn", "X"],
      language: "English",
      campaignPeriod: "Week 1 - Earth Month Launch",
    },
  },
  {
    name: "🛡️ Enterprise Cybersecurity",
    data: {
      brandName: "FortressGuard",
      brandDescription:
        "Autonomous cloud threat detection and continuous compliance platform for regulated financial and healthcare institutions.",
      industry: "Cybersecurity & Cloud Infrastructure",
      targetAudience: "CISOs, Security Directors, and Cloud Architects in FinTech and HealthTech",
      website: "https://fortressguard.io",
      contentGoal: "Lead Generation & High-Trust Authority",
      tone: "Serious, Technical & Decisive",
      targetKeywords: ["zero trust architecture", "cloud threat detection", "SOC2 compliance automation", "API security"],
      platforms: ["LinkedIn", "X"],
      language: "English",
      campaignPeriod: "Week 1 - Cloud Risk Audit",
    },
  },
];

export const BrandSetupTab: React.FC<BrandSetupTabProps> = ({
  brand,
  onUpdateBrand,
  onStartPipeline,
  isGenerating,
}) => {
  const [formData, setFormData] = useState<BrandProfile>(brand);
  const [keywordInput, setKeywordInput] = useState(
    brand.targetKeywords ? brand.targetKeywords.join(", ") : ""
  );
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [savedNotice, setSavedNotice] = useState(false);

  const availablePlatforms: Platform[] = ["LinkedIn", "Instagram", "X"];

  const handleApplyPreset = (preset: Partial<BrandProfile>) => {
    const updated: BrandProfile = {
      ...formData,
      ...preset,
      targetKeywords: preset.targetKeywords || formData.targetKeywords,
      platforms: preset.platforms || formData.platforms,
    };
    setFormData(updated);
    setKeywordInput(updated.targetKeywords.join(", "));
    onUpdateBrand(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleTogglePlatform = (p: Platform) => {
    const exists = formData.platforms.includes(p);
    const updatedPlatforms = exists
      ? formData.platforms.filter((item) => item !== p)
      : [...formData.platforms, p];

    // Ensure at least 1 platform is selected
    if (updatedPlatforms.length === 0) return;

    const updated = { ...formData, platforms: updatedPlatforms };
    setFormData(updated);
    onUpdateBrand(updated);
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.brandName.trim()) {
      errors.brandName = "Brand name is required.";
    }
    if (!formData.brandDescription.trim()) {
      errors.brandDescription = "Brand description is required.";
    }
    if (!formData.industry.trim()) {
      errors.industry = "Industry or niche is required.";
    }
    if (!formData.targetAudience.trim()) {
      errors.targetAudience = "Target audience description is required.";
    }
    if (formData.platforms.length === 0) {
      errors.platforms = "Select at least one social media platform.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const keywords = keywordInput
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const finalized: BrandProfile = {
      ...formData,
      targetKeywords: keywords,
    };

    onUpdateBrand(finalized);
    onStartPipeline();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header card */}
      <div className="glass-panel p-6 rounded-2xl border border-violet-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-violet-400" /> Brand Identity & Campaign Configuration
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Configure your brand specifications. All four AI agents will use this profile to plan,
              research, generate, and fact-check content.
            </p>
          </div>

          {savedNotice && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs font-semibold animate-pulse">
              <Check className="w-3.5 h-3.5" /> Preset Loaded
            </div>
          )}
        </div>

        {/* Quick Presets Selector */}
        <div className="mt-5 pt-4 border-t border-zinc-800/80">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Quick-Start Templates (One Click)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRESET_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.name}
                type="button"
                onClick={() => handleApplyPreset(tmpl.data)}
                className="px-3 py-2 rounded-xl text-left text-xs bg-zinc-900/80 hover:bg-violet-950/40 border border-zinc-800 hover:border-violet-500/40 text-zinc-200 transition-all font-medium"
              >
                {tmpl.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80 space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-violet-400 flex items-center gap-2">
            <Building2 className="w-4 h-4" /> 1. Core Brand Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Brand Name */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Brand Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => {
                  setFormData({ ...formData, brandName: e.target.value });
                  onUpdateBrand({ ...formData, brandName: e.target.value });
                }}
                placeholder="e.g. AgentScale AI"
                className={`w-full bg-[#0d101d] text-zinc-100 text-xs rounded-xl px-3.5 py-2.5 border focus:outline-none transition-all ${
                  validationErrors.brandName
                    ? "border-rose-500 focus:border-rose-400"
                    : "border-zinc-800 focus:border-violet-500"
                }`}
              />
              {validationErrors.brandName && (
                <p className="text-[11px] text-rose-400 mt-1">{validationErrors.brandName}</p>
              )}
            </div>

            {/* Industry */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Industry or Niche <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => {
                  setFormData({ ...formData, industry: e.target.value });
                  onUpdateBrand({ ...formData, industry: e.target.value });
                }}
                placeholder="e.g. Artificial Intelligence & Enterprise Automation"
                className={`w-full bg-[#0d101d] text-zinc-100 text-xs rounded-xl px-3.5 py-2.5 border focus:outline-none transition-all ${
                  validationErrors.industry
                    ? "border-rose-500 focus:border-rose-400"
                    : "border-zinc-800 focus:border-violet-500"
                }`}
              />
              {validationErrors.industry && (
                <p className="text-[11px] text-rose-400 mt-1">{validationErrors.industry}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Brand Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.brandDescription}
              onChange={(e) => {
                setFormData({ ...formData, brandDescription: e.target.value });
                onUpdateBrand({ ...formData, brandDescription: e.target.value });
              }}
              placeholder="Explain what your brand does, key value propositions, and flagship capabilities..."
              className={`w-full bg-[#0d101d] text-zinc-100 text-xs rounded-xl p-3 border focus:outline-none transition-all ${
                validationErrors.brandDescription
                  ? "border-rose-500 focus:border-rose-400"
                  : "border-zinc-800 focus:border-violet-500"
              }`}
            />
            {validationErrors.brandDescription && (
              <p className="text-[11px] text-rose-400 mt-1">{validationErrors.brandDescription}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target Audience */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Target Audience & Ideal Customer <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => {
                  setFormData({ ...formData, targetAudience: e.target.value });
                  onUpdateBrand({ ...formData, targetAudience: e.target.value });
                }}
                placeholder="e.g. CTOs, Engineering Leads, Operations Directors"
                className={`w-full bg-[#0d101d] text-zinc-100 text-xs rounded-xl px-3.5 py-2.5 border focus:outline-none transition-all ${
                  validationErrors.targetAudience
                    ? "border-rose-500 focus:border-rose-400"
                    : "border-zinc-800 focus:border-violet-500"
                }`}
              />
              {validationErrors.targetAudience && (
                <p className="text-[11px] text-rose-400 mt-1">{validationErrors.targetAudience}</p>
              )}
            </div>

            {/* Website (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center justify-between">
                <span>Brand Website (Optional)</span>
                <Globe className="w-3.5 h-3.5 text-zinc-500" />
              </label>
              <input
                type="url"
                value={formData.website || ""}
                onChange={(e) => {
                  setFormData({ ...formData, website: e.target.value });
                  onUpdateBrand({ ...formData, website: e.target.value });
                }}
                placeholder="https://example.com"
                className="w-full bg-[#0d101d] text-zinc-100 text-xs rounded-xl px-3.5 py-2.5 border border-zinc-800 focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Strategic Marketing Directives */}
        <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80 space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-violet-400 flex items-center gap-2">
            <Target className="w-4 h-4" /> 2. Content Strategy Directives
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Content Goal */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Main Content Goal
              </label>
              <select
                value={formData.contentGoal}
                onChange={(e) => {
                  setFormData({ ...formData, contentGoal: e.target.value });
                  onUpdateBrand({ ...formData, contentGoal: e.target.value });
                }}
                className="w-full bg-[#0d101d] text-zinc-100 text-xs rounded-xl px-3.5 py-2.5 border border-zinc-800 focus:border-violet-500 focus:outline-none cursor-pointer"
              >
                <option value="Thought Leadership & High-Trust Authority">
                  Thought Leadership & High-Trust Authority
                </option>
                <option value="Lead Generation & Product Conversions">
                  Lead Generation & Product Conversions
                </option>
                <option value="Audience Education & Problem Awareness">
                  Audience Education & Problem Awareness
                </option>
                <option value="Brand Positioning & Organic Reach">
                  Brand Positioning & Organic Reach
                </option>
                <option value="Customer Retention & Ecosystem Advocacy">
                  Customer Retention & Ecosystem Advocacy
                </option>
              </select>
            </div>

            {/* Writing Tone */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Preferred Writing Tone
              </label>
              <select
                value={formData.tone}
                onChange={(e) => {
                  setFormData({ ...formData, tone: e.target.value });
                  onUpdateBrand({ ...formData, tone: e.target.value });
                }}
                className="w-full bg-[#0d101d] text-zinc-100 text-xs rounded-xl px-3.5 py-2.5 border border-zinc-800 focus:border-violet-500 focus:outline-none cursor-pointer"
              >
                <option value="Authoritative, Analytical & Visionary">
                  Authoritative, Analytical & Visionary
                </option>
                <option value="Conversational, Relatable & Engaging">
                  Conversational, Relatable & Engaging
                </option>
                <option value="Educational, Practical & Actionable">
                  Educational, Practical & Actionable
                </option>
                <option value="Direct, Executive & Bold">
                  Direct, Executive & Bold
                </option>
                <option value="Friendly, Enthusiastic & Inspiring">
                  Friendly, Enthusiastic & Inspiring
                </option>
              </select>
            </div>
          </div>

          {/* Target Keywords */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center justify-between">
              <span>Target Keywords (comma-separated)</span>
              <Hash className="w-3.5 h-3.5 text-zinc-500" />
            </label>
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="e.g. AI agents, workflow automation, verification, ROI"
              className="w-full bg-[#0d101d] text-zinc-100 text-xs rounded-xl px-3.5 py-2.5 border border-zinc-800 focus:border-violet-500 focus:outline-none"
            />
          </div>

          {/* Social Platforms */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-zinc-400" /> Preferred Social Platforms (Selected: {formData.platforms.length})
            </label>
            <div className="flex flex-wrap gap-3">
              {availablePlatforms.map((platform) => {
                const isSelected = formData.platforms.includes(platform);
                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => handleTogglePlatform(platform)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                      isSelected
                        ? "bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-900/30"
                        : "bg-zinc-900/70 text-zinc-400 border-zinc-800 hover:text-zinc-200"
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${isSelected ? "opacity-100" : "opacity-0"}`} />
                    <span>{platform}</span>
                  </button>
                );
              })}
            </div>
            {validationErrors.platforms && (
              <p className="text-[11px] text-rose-400 mt-1">{validationErrors.platforms}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Language */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center justify-between">
                <span>Content Language</span>
                <Languages className="w-3.5 h-3.5 text-zinc-500" />
              </label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => {
                  setFormData({ ...formData, language: e.target.value });
                  onUpdateBrand({ ...formData, language: e.target.value });
                }}
                placeholder="English"
                className="w-full bg-[#0d101d] text-zinc-100 text-xs rounded-xl px-3.5 py-2.5 border border-zinc-800 focus:border-violet-500 focus:outline-none"
              />
            </div>

            {/* Campaign Period */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center justify-between">
                <span>Campaign Period / Batch</span>
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              </label>
              <input
                type="text"
                value={formData.campaignPeriod}
                onChange={(e) => {
                  setFormData({ ...formData, campaignPeriod: e.target.value });
                  onUpdateBrand({ ...formData, campaignPeriod: e.target.value });
                }}
                placeholder="Week 1"
                className="w-full bg-[#0d101d] text-zinc-100 text-xs rounded-xl px-3.5 py-2.5 border border-zinc-800 focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-purple-500 transition-all shadow-xl shadow-violet-900/40 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Weekly Content Pack</span>
          </button>
        </div>
      </form>
    </div>
  );
};
