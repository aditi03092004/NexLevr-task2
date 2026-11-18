import { Campaign, BrandProfile, ToolExecutionLog } from "../types";

const STORAGE_KEY = "ai_content_agent_campaigns_v1";
const ACTIVE_CAMPAIGN_KEY = "ai_content_agent_active_id_v1";

export function getStoredCampaigns(): Campaign[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Campaign[];
  } catch (e) {
    console.error("Failed to load campaigns from localStorage", e);
    return [];
  }
}

export function saveCampaigns(campaigns: Campaign[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
  } catch (e) {
    console.error("Failed to persist campaigns to localStorage", e);
  }
}

export function getActiveCampaignId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_CAMPAIGN_KEY);
}

export function setActiveCampaignId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_CAMPAIGN_KEY, id);
}

export function saveSingleCampaign(campaign: Campaign): void {
  const current = getStoredCampaigns();
  const index = current.findIndex((c) => c.id === campaign.id);
  let updated: Campaign[];

  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...campaign, updatedAt: new Date().toISOString() };
  } else {
    updated = [campaign, ...current];
  }

  saveCampaigns(updated);
  setActiveCampaignId(campaign.id);
}

export function deleteCampaign(id: string): Campaign[] {
  const current = getStoredCampaigns();
  const filtered = current.filter((c) => c.id !== id);
  saveCampaigns(filtered);

  if (getActiveCampaignId() === id) {
    if (filtered.length > 0) {
      setActiveCampaignId(filtered[0].id);
    } else {
      if (typeof window !== "undefined") {
        localStorage.removeItem(ACTIVE_CAMPAIGN_KEY);
      }
    }
  }

  return filtered;
}

export function createNewCampaign(brand: BrandProfile, isDemo = false): Campaign {
  const now = new Date().toISOString();
  return {
    id: `camp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: now,
    updatedAt: now,
    brand,
    agentStatuses: {
      planner: { state: "waiting", message: "Ready to analyze brand and craft weekly theme." },
      researcher: { state: "waiting", message: "Awaiting planner output to start live web search." },
      writer: { state: "waiting", message: "Awaiting research sources to generate articles." },
      reviewer: { state: "waiting", message: "Awaiting generated drafts to audit factual claims." },
    },
    logs: [],
    isDemoMode: isDemo,
  };
}

export function appendLogsToCampaign(campaign: Campaign, newLogs: ToolExecutionLog[]): Campaign {
  return {
    ...campaign,
    logs: [...newLogs, ...campaign.logs],
    updatedAt: new Date().toISOString(),
  };
}
