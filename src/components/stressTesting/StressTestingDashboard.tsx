import React, { useState, useEffect, useCallback } from "react";
import {
  StressTestSuiteReport,
  TestExecutionResult,
  TestCategory,
  TestStatus,
  BeforeAfterComparison,
} from "@/lib/stressTesting/types";
import { STRESS_TEST_SUITE } from "@/lib/stressTesting/testSuite";
import { TestCard } from "./TestCard";
import { BeforeAfterTab } from "./BeforeAfterTab";
import { ReportsTab } from "./ReportsTab";
import {
  ShieldAlert,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  TrendingUp,
  FileText,
  Search,
  Filter,
  Layers,
  Sparkles,
} from "lucide-react";

export const StressTestingDashboard: React.FC = () => {
  const [subTab, setSubTab] = useState<
    | "overview"
    | "contradictory"
    | "injection"
    | "offtopic"
    | "context"
    | "reliability"
    | "comparison"
    | "reports"
  >("overview");

  const [phase, setPhase] = useState<"AFTER_FIXES" | "BEFORE_FIXES">("AFTER_FIXES");
  const [report, setReport] = useState<StressTestSuiteReport | null>(null);
  const [comparison, setComparison] = useState<BeforeAfterComparison | null>(null);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [runningTestId, setRunningTestId] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loadingComparison, setLoadingComparison] = useState(false);

  // Fetch or execute test report
  const loadTestSuite = useCallback(async (targetPhase: "AFTER_FIXES" | "BEFORE_FIXES") => {
    try {
      const res = await fetch("/api/stress-testing/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase: targetPhase }),
      });
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch (err) {
      console.error("Failed to load stress test suite:", err);
    }
  }, []);

  // Fetch before/after comparison
  const loadComparison = useCallback(async () => {
    setLoadingComparison(true);
    try {
      const res = await fetch("/api/stress-testing/comparison");
      if (res.ok) {
        const data = await res.json();
        setComparison(data);
      }
    } catch (err) {
      console.error("Failed to load comparison:", err);
    } finally {
      setLoadingComparison(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadTestSuite(phase);
    loadComparison();
  }, [phase, loadTestSuite, loadComparison]);

  // Run all stress tests with real-time progress simulation
  const handleRunAllTests = async () => {
    setIsRunningAll(true);
    const total = STRESS_TEST_SUITE.length;
    setProgress({ current: 0, total });

    try {
      const res = await fetch("/api/stress-testing/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase }),
      });

      if (res.ok) {
        const data: StressTestSuiteReport = await res.json();
        setReport(data);
        setProgress({ current: total, total });
        loadComparison();
      }
    } catch (err) {
      console.error("Error executing stress test suite:", err);
    } finally {
      setIsRunningAll(false);
      setTimeout(() => setProgress(null), 1500);
    }
  };

  // Run individual test case
  const handleRunSingleTest = async (testId: string) => {
    setRunningTestId(testId);
    try {
      const res = await fetch("/api/stress-testing/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase, testId }),
      });

      if (res.ok) {
        const data = await res.json();
        const updatedResult: TestExecutionResult = data.result;

        // Update single result in report state
        setReport((prev) => {
          if (!prev) return prev;
          const updatedResults = prev.results.map((r) =>
            r.testId === testId ? updatedResult : r
          );
          if (!prev.results.some((r) => r.testId === testId)) {
            updatedResults.push(updatedResult);
          }

          const passed = updatedResults.filter((r) => r.status === "PASSED").length;
          const failed = updatedResults.filter((r) => r.status === "FAILED").length;
          const vulns = updatedResults.filter((r) => !!r.vulnerabilityDetected).length;

          return {
            ...prev,
            results: updatedResults,
            testsPassed: passed,
            testsFailed: failed,
            vulnerabilitiesDetected: vulns,
            overallReliabilityScore: Math.round((passed / updatedResults.length) * 100),
          };
        });
      }
    } catch (err) {
      console.error(`Failed to run single test ${testId}:`, err);
    } finally {
      setRunningTestId(null);
    }
  };

  // Filter test cases based on subTab, search, and status
  const getFilteredTests = () => {
    let list = STRESS_TEST_SUITE;

    // Filter by subTab category
    if (subTab === "contradictory") {
      list = list.filter((t) => t.category === "contradictory_instructions");
    } else if (subTab === "injection") {
      list = list.filter((t) => t.category === "prompt_injection");
    } else if (subTab === "offtopic") {
      list = list.filter((t) => t.category === "off_topic");
    } else if (subTab === "context") {
      list = list.filter((t) => t.category === "context_limits");
    } else if (subTab === "reliability") {
      list = list.filter((t) => t.category === "reliability");
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.targetAgent.toLowerCase().includes(q)
      );
    }

    // Filter by status if selected
    if (statusFilter !== "ALL" && report) {
      list = list.filter((t) => {
        const res = report.results.find((r) => r.testId === t.id);
        const st = res ? res.status : "PENDING";
        return st === statusFilter;
      });
    }

    return list;
  };

  const getResultForTest = (id: string): TestExecutionResult | undefined => {
    return report?.results.find((r) => r.testId === id);
  };

  const totalTests = report ? report.totalTests : STRESS_TEST_SUITE.length;
  const passedCount = report ? report.testsPassed : 0;
  const failedCount = report ? report.testsFailed : 0;
  const vulnsCount = report ? report.vulnerabilitiesDetected : 0;
  const bugsFixedCount = report ? report.bugsFixed : 0;
  const reliabilityScore = report ? report.overallReliabilityScore : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-[#0e1222] border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  AI Agent Stress Testing & Reliability Framework
                </h1>
                <p className="text-xs text-zinc-400">
                  Adversarial Prompt Injection, Boundary Enforcement, Contradiction Resolution & Resilience Verification
                </p>
              </div>
            </div>
          </div>

          {/* Execution Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Phase Switcher */}
            <div className="flex items-center bg-[#090b14] p-1 rounded-xl border border-zinc-800 text-xs">
              <button
                onClick={() => setPhase("BEFORE_FIXES")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  phase === "BEFORE_FIXES"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Phase 1: Before Fixes
              </button>
              <button
                onClick={() => setPhase("AFTER_FIXES")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  phase === "AFTER_FIXES"
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Phase 3: After Fixes
              </button>
            </div>

            {/* Run All Button */}
            <button
              onClick={handleRunAllTests}
              disabled={isRunningAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-900/40 transition-all disabled:opacity-50"
            >
              {isRunningAll ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Running Stress Suite...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Run All Stress Tests
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real-time Progress Bar */}
        {progress && (
          <div className="mt-5 pt-4 border-t border-zinc-800/80">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
              <span className="font-semibold text-violet-400">
                Executing Stress Test Matrix ({progress.current}/{progress.total})
              </span>
              <span>{Math.round((progress.current / progress.total) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* KPI Metrics Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Tests */}
        <div className="bg-[#0e1222] border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Tests</span>
            <Layers className="w-3.5 h-3.5 text-zinc-500" />
          </div>
          <div className="text-2xl font-bold text-white">{totalTests}</div>
          <span className="text-[10px] text-zinc-400 mt-0.5 block">5 Core Categories</span>
        </div>

        {/* Tests Passed */}
        <div className="bg-[#0e1222] border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Passed</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{passedCount}</div>
          <span className="text-[10px] text-zinc-400 mt-0.5 block">
            {totalTests > 0 ? `${Math.round((passedCount / totalTests) * 100)}% pass rate` : "0%"}
          </span>
        </div>

        {/* Tests Failed */}
        <div className="bg-[#0e1222] border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-rose-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Failed</span>
            <XCircle className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-bold text-rose-400">{failedCount}</div>
          <span className="text-[10px] text-zinc-400 mt-0.5 block">Strict assertion checks</span>
        </div>

        {/* Vulnerabilities Detected */}
        <div className="bg-[#0e1222] border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-amber-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Vulnerabilities</span>
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{vulnsCount}</div>
          <span className="text-[10px] text-zinc-400 mt-0.5 block">Security & prompt flaws</span>
        </div>

        {/* Bugs Fixed */}
        <div className="bg-[#0e1222] border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-indigo-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Bugs Fixed</span>
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-bold text-indigo-400">{bugsFixedCount}</div>
          <span className="text-[10px] text-zinc-400 mt-0.5 block">Hardened application guards</span>
        </div>

        {/* Overall Reliability Score */}
        <div className="bg-[#0e1222] border border-zinc-800 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-violet-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Reliability Score</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-bold text-violet-400">{reliabilityScore}%</div>
          <span className="text-[10px] text-zinc-400 mt-0.5 block">Composite assurance metric</span>
        </div>
      </div>

      {/* 8 Required Tabs Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-zinc-800 text-xs font-semibold scrollbar-none">
        {[
          { id: "overview", label: "Overview", icon: Layers, count: totalTests },
          { id: "contradictory", label: "Confusing Instructions", icon: AlertTriangle, count: 4 },
          { id: "injection", label: "Prompt Injection", icon: ShieldAlert, count: 7 },
          { id: "offtopic", label: "Off-Topic Requests", icon: Filter, count: 4 },
          { id: "context", label: "Long Task Testing", icon: Zap, count: 5 },
          { id: "reliability", label: "Reliability Tests", icon: CheckCircle2, count: 12 },
          { id: "comparison", label: "Before/After Comparison", icon: TrendingUp, count: null },
          { id: "reports", label: "Test Reports", icon: FileText, count: null },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as typeof subTab)}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-lg whitespace-nowrap transition-all ${
                isActive
                  ? "bg-violet-600 text-white shadow-md shadow-violet-900/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? "bg-white/20 text-white" : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {subTab === "comparison" ? (
        <BeforeAfterTab
          comparison={comparison}
          loading={loadingComparison}
          onRefreshComparison={loadComparison}
        />
      ) : subTab === "reports" ? (
        <ReportsTab report={report} comparison={comparison} />
      ) : (
        /* Test List Views (Overview and Categories) */
        <div className="space-y-4">
          {/* Filters & Search Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0e1222] border border-zinc-800 p-3 rounded-xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search test ID, name, or agent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#090b14] border border-zinc-800 text-zinc-200 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
              <span className="text-zinc-400 text-[11px] font-medium">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#090b14] border border-zinc-800 text-zinc-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-violet-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="PASSED">Passed Only</option>
                <option value="FAILED">Failed Only</option>
                <option value="PENDING">Pending Only</option>
                <option value="NEEDS_REVIEW">Needs Review Only</option>
              </select>
            </div>
          </div>

          {/* Test Cards List */}
          <div className="space-y-3">
            {getFilteredTests().map((testCase) => (
              <TestCard
                key={testCase.id}
                testCase={testCase}
                result={getResultForTest(testCase.id)}
                isRunning={runningTestId === testCase.id || isRunningAll}
                onRunTest={handleRunSingleTest}
              />
            ))}

            {getFilteredTests().length === 0 && (
              <div className="p-12 text-center text-zinc-500 bg-[#0e1222] border border-zinc-800 rounded-xl text-xs">
                No stress test cases match your search or filter criteria.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
