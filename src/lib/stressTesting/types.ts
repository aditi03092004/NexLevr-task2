// ============================================================================
// AI Agent Stress Testing & Reliability Framework - Type Definitions
// ============================================================================

export type TestCategory =
  | "contradictory_instructions"
  | "prompt_injection"
  | "off_topic"
  | "context_limits"
  | "reliability";

export type TestStatus = "PENDING" | "RUNNING" | "PASSED" | "FAILED" | "NEEDS_REVIEW";

export type VulnerabilitySeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";

export interface TestAssertion {
  id: string;
  description: string;
  passed: boolean;
  actualValue?: unknown;
  expectedValue?: unknown;
  failureReason?: string;
}

export interface TestCase {
  id: string;
  category: TestCategory;
  name: string;
  description: string;
  targetAgent: "Planner" | "Researcher" | "Writer" | "Reviewer" | "Pipeline" | "System";
  inputPayload: Record<string, unknown>;
  expectedBehaviour: string;
  severity: VulnerabilitySeverity;
  cweOrOwaspCategory?: string; // e.g., "OWASP LLM01: Prompt Injection", "OWASP LLM06: Sensitive Info Disclosure"
}

export interface TestExecutionResult {
  testId: string;
  category: TestCategory;
  name: string;
  description: string;
  targetAgent: string;
  inputPayload: Record<string, unknown>;
  expectedBehaviour: string;
  actualResult: {
    status: TestStatus;
    summary: string;
    rawOutput?: unknown;
    error?: string;
  };
  assertions: TestAssertion[];
  status: TestStatus;
  durationMs: number;
  failureExplanation?: string;
  recommendedFix?: string;
  vulnerabilityDetected?: {
    type: string;
    severity: VulnerabilitySeverity;
    details: string;
  };
  executedAt: string;
  phase: "BEFORE_FIXES" | "AFTER_FIXES";
}

export interface CategorySummary {
  category: TestCategory;
  categoryName: string;
  totalTests: number;
  passed: number;
  failed: number;
  needsReview: number;
  vulnerabilities: number;
  score: number; // 0 - 100
}

export interface StressTestSuiteReport {
  suiteId: string;
  timestamp: string;
  phase: "BEFORE_FIXES" | "AFTER_FIXES";
  totalTests: number;
  testsPassed: number;
  testsFailed: number;
  testsNeedsReview: number;
  vulnerabilitiesDetected: number;
  bugsFixed: number;
  overallReliabilityScore: number; // 0 - 100
  categories: Record<TestCategory, CategorySummary>;
  results: TestExecutionResult[];
}

export interface BeforeAfterComparison {
  beforeReport: StressTestSuiteReport;
  afterReport: StressTestSuiteReport;
  metricsComparison: {
    totalTests: { before: number; after: number; delta: number };
    testsPassed: { before: number; after: number; delta: number };
    testsFailed: { before: number; after: number; delta: number };
    vulnerabilitiesDetected: { before: number; after: number; delta: number };
    bugsFixed: number;
    overallReliabilityScore: { before: number; after: number; delta: number };
  };
  vulnerabilitiesResolved: {
    id: string;
    title: string;
    category: TestCategory;
    severity: VulnerabilitySeverity;
    rootCause: string;
    fixImplemented: string;
    verifiedAfterFix: boolean;
  }[];
  remainingLimitations: string[];
}
