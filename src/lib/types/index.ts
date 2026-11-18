// ==========================================
// Multi-Step AI Content Agent - Type Definitions
// ==========================================

export type Platform = 'LinkedIn' | 'Instagram' | 'X';

export interface BrandProfile {
  id: string;
  brandName: string;
  brandDescription: string;
  industry: string;
  targetAudience: string;
  website?: string;
  contentGoal: string;
  tone: string;
  targetKeywords: string[];
  platforms: Platform[];
  language: string;
  campaignPeriod: string;
  createdAt: string;
}

export interface PlannerOutput {
  weeklyTheme: string;
  contentObjectives: string[];
  targetAudienceInsights: {
    problems: string[];
    interests: string[];
    motivations: string[];
  };
  marketingStrategy: string;
  blogTopic: {
    title: string;
    angle: string;
    targetKeywords: string[];
  };
  socialTopics: {
    post1: { platform: Platform; type: string; topic: string; angle: string };
    post2: { platform: Platform; type: string; topic: string; angle: string };
    post3: { platform: Platform; type: string; topic: string; angle: string };
  };
  newsletterTopic: {
    subjectProposal: string;
    theme: string;
    keyTakeaways: string[];
  };
  suggestedKeywords: string[];
  researchQuestions: string[];
}

export interface ResearchSource {
  id: string;
  title: string;
  url: string;
  content: string;
  publishedDate?: string;
  score?: number;
  sourceType?: string;
}

export interface VerifiedFact {
  fact: string;
  sourceUrl: string;
  sourceTitle: string;
  category: string;
}

export interface VerifiedStatistic {
  statistic: string;
  sourceUrl: string;
  sourceTitle: string;
  context: string;
}

export interface ResearcherOutput {
  topic: string;
  summary: string;
  sources: ResearchSource[];
  verifiedFacts: VerifiedFact[];
  statistics: VerifiedStatistic[];
  industryTrends: string[];
  isLiveSearch: boolean;
  queryLog: string[];
  researchedAt: string;
}

export interface BlogArticle {
  headline: string;
  metaDescription: string;
  readTime: string;
  introduction: string;
  sections: {
    heading: string;
    content: string;
  }[];
  examples: string[];
  conclusion: string;
  callToAction: string;
  references: {
    title: string;
    url: string;
  }[];
}

export interface SocialPost {
  id: string;
  type: 'educational' | 'engaging' | 'thought_leadership';
  platform: Platform;
  hook: string;
  content: string;
  callToAction: string;
  hashtags: string[];
}

export interface EmailNewsletter {
  subjectLine: string;
  previewText: string;
  greeting: string;
  introduction: string;
  mainContent: string;
  keyTakeaways: string[];
  callToAction: string;
  closing: string;
}

export interface WriterOutput {
  blog: BlogArticle;
  socialPosts: SocialPost[];
  newsletter: EmailNewsletter;
  generatedAt: string;
}

export type ClaimStatus = 'GREEN' | 'YELLOW' | 'RED';

export interface ClaimVerification {
  id: string;
  claimText: string;
  contentLocation: string; // e.g. "Blog - Section 2", "Newsletter"
  status: ClaimStatus; // GREEN: Supported, YELLOW: Needs verification, RED: Unsupported
  explanation: string;
  matchedSource?: {
    title: string;
    url: string;
  };
  suggestedCorrection?: string;
}

export interface CorrectionSuggestion {
  target: string;
  current: string;
  suggested: string;
  reason: string;
}

export interface ReviewerReport {
  totalClaims: number;
  supportedClaims: number;
  unsupportedClaims: number;
  needsVerificationClaims: number;
  sourcesChecked: number;
  qualityScore: number; // 0 - 100
  qualityScoreRationale: string;
  grammarAndReadability: {
    score: number;
    feedback: string[];
  };
  brandVoiceAdherence: {
    score: number;
    feedback: string[];
  };
  repetitionCheck: {
    hasRepetition: boolean;
    findings: string[];
  };
  claims: ClaimVerification[];
  suggestedCorrections: CorrectionSuggestion[];
  overallVerdict: 'PASSED' | 'PASSED_WITH_WARNINGS' | 'NEEDS_REVISION';
  reviewedAt: string;
}

export type AgentName = 'Planner' | 'Researcher' | 'Writer' | 'Reviewer' | 'Orchestrator';
export type LogStatus = 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO';

export interface ToolExecutionLog {
  id: string;
  timestamp: string;
  agentName: AgentName;
  toolName: string;
  inputSummary: string;
  outputSummary: string;
  status: LogStatus;
  durationMs: number;
  errorMessage?: string;
  details?: Record<string, unknown>;
}

export type AgentExecutionState = 'waiting' | 'running' | 'completed' | 'failed';

export interface AgentStatus {
  state: AgentExecutionState;
  message?: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface Campaign {
  id: string;
  createdAt: string;
  updatedAt: string;
  brand: BrandProfile;
  agentStatuses: {
    planner: AgentStatus;
    researcher: AgentStatus;
    writer: AgentStatus;
    reviewer: AgentStatus;
  };
  plannerOutput?: PlannerOutput;
  researcherOutput?: ResearcherOutput;
  writerOutput?: WriterOutput;
  reviewerReport?: ReviewerReport;
  logs: ToolExecutionLog[];
  isDemoMode: boolean;
}

export interface ApiKeyStatus {
  hasGeminiKey: boolean;
  hasTavilyKey: boolean;
  geminiModel: string;
  demoModeAvailable: boolean;
}
