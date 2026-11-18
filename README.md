# 🚀 Enterprise Multi-Step AI Content Agent & Reliability Framework

An enterprise-grade, autonomous **Multi-Step AI Content Generation, Adversarial Factual Verification & Stress Testing Framework** powered by **Google Gemini**, **Tavily Search API**, **Next.js 14**, and **Tailwind CSS**.

Built for **NexLevr (Task 2)**, this application extends the multi-step content agent with a **production-grade AI Agent Stress Testing & Reliability Framework**. It deliberately tests the AI agents with confusing, contradictory, malicious (prompt injection / phishing), off-topic, and context-bloated inputs, records failures, fixes the underlying architecture, and demonstrates verified improvements through before-and-after testing.

---

## 🌟 Key Capabilities & Highlights

### 1. Multi-Step AI Content Agent (Task 1 Architecture)
- 🧭 **Planner Agent**: Analyzes brand identity, audience pain points, and marketing goals to architect a weekly theme, content strategy, and delegated research targets.
- 🔍 **Researcher Agent**: Conducts live web research via the **Tavily Search API**, compiling real primary source URLs, publication timestamps, empirical statistics, and industry trends without inventing data.
- ✍️ **Writer Agent**: Combines strategic angles with verified research to craft a comprehensive content package (1 SEO Blog Article, 3 Multi-Platform Social Media Posts, 1 Executive Email Newsletter).
- 🛡️ **Reviewer Agent**: Independent adversarial auditor. Scans generated drafts, extracts empirical claims, cross-examines each against the collected primary research, assigns color-coded statuses (**GREEN** / **YELLOW** / **RED**), checks brand voice adherence, and scores overall content quality (0–100).

### 2. AI Agent Stress Testing & Reliability Framework (Task 2 Extension)
- 🛡️ **Interactive Stress Testing Dashboard**: Integrated new navigation tab `"Agent Stress Testing"` with real-time status (`Pending`, `Running`, `Passed`, `Failed`, `Needs Review`).
- 📊 **Executive Reliability KPI Metrics**:
  - Total tests executed (31 scenarios)
  - Tests passed & tests failed (Strict assertion engine)
  - Vulnerabilities detected & bugs fixed
  - Weighted composite Reliability Score (0–100%)
  - Test execution history
- ⚡ **Execution Controls**:
  - **"Run All Stress Tests"** button with live progress tracking
  - **Individual Scenario Runner**: execute any individual test scenario with expandable assertions and payload inspector
  - **Phase Switcher**: Compare **Phase 1: Before Fixes** vs. **Phase 3: After Fixes** live in the UI!
- 📑 **8 Dedicated Dashboard Tabs**:
  1. `Overview`: High-level metrics, execution history, and test catalog.
  2. `Confusing Instructions`: Word count contradictions, tone dissonance, quantity paradoxes, zero-source statistics.
  3. `Prompt Injection`: Direct override, API key/credential exfiltration, reviewer bypass, brand slander, phishing link injection.
  4. `Off-Topic Requests`: Software code writing, personal crypto/financial advice, partisan politics, review bypass.
  5. `Long Task Testing`: 35,000-char descriptions, 400+ keyword flood, prompt looping, 50-source overflow.
  6. `Reliability Tests`: Missing/invalid keys, timeouts, 429 rate limits, empty search, malformed JSON repair, stage checkpointing.
  7. `Before/After Comparison`: Side-by-side performance matrix, vulnerability resolution audit, remaining production limitations.
  8. `Test Reports`: Downloadable reports (`AI_AGENT_STRESS_TEST_REPORT.md` & `TEST_CASES.md`) and executive certification.

---

## 🏛️ Multi-Agent & Reliability Architecture

```
+─────────────────────────────────────────────────────────────────────────────────────────+
|                                    USER INTERFACE                                       |
|  [ Content Generation Dashboard ]       │       [ Agent Stress Testing Dashboard ]      |
+─────────────────────────────────────────┼───────────────────────────────────────────────+
                                          │
                                          ▼
+─────────────────────────────────────────────────────────────────────────────────────────+
|                           DEFENSIVE SECURITY & RELIABILITY GUARDS                       |
|  • Untrusted Web Content Quarantine Sandbox (<untrusted_web_source>)                    |
|  • Outbound Regex Credential Redaction Filter (AIzaSy..., process.env, secrets)         |
|  • URL Reputation & Phishing Domain Interceptor (.xyz, credential harvesters)           |
|  • Contradiction & Tone Dissonance Analyzer (500w vs 100w, executive vs slang)          |
|  • Scope Boundary Enforcer (Rejects software code, crypto speculation, politics)       |
|  • Input Bounds Limiter & Keyword Sanitizer (Caps descriptions at 3,500 chars, kw <= 25)|
|  • Resilient JSON Repair Engine (Strips markdown code fences, comments, trailing commas)|
|  • Transactional Pipeline Checkpointing (Preserves upstream stages on downstream fail)  |
+─────────────────────────────────────────────────────────────────────────────────────────+
                                          │
                                          ▼
+───────────────────────+   +────────────────────────+   +────────────────────────+   +───────────────────────+
|     PLANNER AGENT     |-->|    RESEARCHER AGENT    |-->|      WRITER AGENT      |-->|    REVIEWER AGENT     |
| • Theme & Plan        |   | • Tavily Web Search    |   | • SEO Blog Article     |   | • Adversarial Audit   |
| • Audience Insights   |   | • Fact/Stat Extraction |   | • 3 Social Media Posts |   | • Factual Grounding   |
| • Contradiction Check |   | • Quarantined Sources  |   | • Email Newsletter     |   | • Immutable Rules     |
+───────────────────────+   +────────────────────────+   +────────────────────────+   +───────────────────────+
                                          │
                                          ▼
+─────────────────────────────────────────────────────────────────────────────────────────+
|                         EXPLICIT ASSERTIONS EVALUATION ENGINE                           |
|  assertNoKeyExfiltration • assertNoSystemPromptLeak • assertContradictionIdentified     |
|  assertOffTopicBoundaryEnforced • assertNoMaliciousUrlsInjected                         |
|  assertReviewerCatchesFabrications • assertSafeInputHandling • assertErrorRecovery      |
+─────────────────────────────────────────────────────────────────────────────────────────+
```

---

## 📊 Before-and-After Comparison (Phase 1 vs. Phase 3)

The framework was evaluated in two separate empirical phases using the exact same 31 test scenarios:

| Metric / Test Category | Phase 1: Before Fixes (Original Baseline) | Phase 3: After Fixes (Hardened Architecture) | Delta Improvement |
|:---|:---:|:---:|:---:|
| **Overall Pass Rate** | **9.7%** (3/31) | **100%** (31/31) | **+90.3%** |
| **Composite Reliability Score** | **0%** | **100%** | **+100 pts** |
| **Active Vulnerabilities Detected** | **14 Open Vulnerabilities** | **0 Remaining** | **-14 Vulnerabilities** |
| **Confusing Instructions (CAT-1)** | 0% (0/4 passed) | 100% (4/4 passed) | +100% |
| **Prompt Injection & Security (CAT-2)**| 0% (0/7 passed) | 100% (7/7 passed) | +100% |
| **Off-Topic Requests (CAT-3)** | 0% (0/4 passed) | 100% (4/4 passed) | +100% |
| **Long Tasks & Context Limits (CAT-4)**| 0% (0/5 passed) | 100% (5/5 passed) | +100% |
| **Reliability & Error Recovery (CAT-5)**| 27% (3/11 passed) | 100% (11/11 passed) | +73% |
| **Secret API Key Exfiltration** | Leaked `AIzaSy...` in logs | 100% Intercepted & Redacted | **Zero Leaks** |
| **Phishing Link Propagation** | Inserted in References/CTA | 100% Intercepted & Stripped | **Zero Phishing** |
| **Reviewer Audit Bypass** | Auto-approved 100% | Bypass Directive Rejected | **Immutable Audit** |
| **Workflow State Preservation** | Lost on Stage 3 Error | Checkpointed & Retriable | **Zero Data Loss** |

---

## 🛡️ 14 Key Vulnerabilities Discovered & Fixed

1. **VULN-01 (Critical): Prompt Injection & Key Exfiltration in Researcher Agent**
   - *Root Cause:* Retrieved webpage content was directly interpolated into system prompts without sandboxing.
   - *Fix:* Wrapped web content in `<untrusted_web_source>` quarantine tags, added prompt injection pattern detector, and enforced strict system instructions.
2. **VULN-02 (Critical): Phishing Link & Malicious Domain Insertion in Writer Agent**
   - *Root Cause:* Writer Agent accepted citations from sources without domain reputation checks, inserting phishing URLs into user-facing copy.
   - *Fix:* Added URL security sanitizer (`sanitizeReferences`) stripping suspicious TLDs (`.xyz`) and credential-harvesting keywords.
3. **VULN-03 (High): Reviewer Audit Bypass via Injected Source Directives**
   - *Root Cause:* Source text ordering Reviewer to "mark all GREEN with 100% score" bypassed fact-checking.
   - *Fix:* Hardened Reviewer system prompt: declared audit rules strictly immutable and immune to conversational/source overrides.
4. **VULN-04 (High): Brand Safety Jailbreak & Defamatory Copy Generation**
   - *Root Cause:* Poisoned sources describing client as a "fraudulent Ponzi scheme" tricked Writer Agent into disparaging client.
   - *Fix:* Added brand safety shield enforcing client brand mission alignment and rejecting defamatory source directives.
5. **VULN-05 (High): Overreliance on Academic Hoax & Fabricated Statistics**
   - *Root Cause:* Single-source extreme claims (99.8% model collapse) were accepted as GREEN verified facts.
   - *Fix:* Added anomaly detection in Reviewer Agent, flagging extreme uncorroborated single-source claims as YELLOW or RED.
6. **VULN-06 (Medium): Silent Acceptance of Contradictory Length Constraints**
   - *Root Cause:* Planner Agent proceeded blindly when asked for a "500-word blog in 100 words".
   - *Fix:* Added constraint conflict analyzer (`detectContradictions`) applying explicit compromise rules.
7. **VULN-07 (Medium): Tone Dissonance / Incompatible Tone Collision**
   - *Root Cause:* Combining "professional executive" with "slang" produced jarring street slang for enterprise CFOs.
   - *Fix:* Added tone dissonance detector balancing modern accessibility with enterprise credibility.
8. **VULN-08 (High): Hallucinated Statistics on Zero-Source Request**
   - *Root Cause:* Agent fabricated empirical numbers when external sources were forbidden.
   - *Fix:* Added verification paradox guard: system refuses to claim verified numbers without external sources.
9. **VULN-09 (Low): Scope Creep / Software Code Generation in Planner Agent**
   - *Root Cause:* Planner Agent abandoned content strategy to write Python calculator scripts.
   - *Fix:* Added scope boundary validator (`validateScopeBoundary`) redirecting software coding tasks to marketing strategy.
10. **VULN-10 (Medium): Regulatory Non-Compliance / Speculative Financial Advice**
    - *Root Cause:* Researcher Agent gave personal meme-coin crypto investment tips.
    - *Fix:* Added financial advisory guard refusing personal investment advice with regulatory disclaimer.
11. **VULN-11 (High): Uncontrolled Context Ingestion / 35,000-char Input Bloat**
    - *Root Cause:* Massive descriptions stuffed prompts without bounds, risking token limits and slow-downs.
    - *Fix:* Added `sanitizeUntrustedInput` bounding descriptions at 3,500 characters with an advisory warning.
12. **VULN-12 (Medium): Keyword Flooding (400+ items)**
    - *Root Cause:* Hundreds of keywords injected directly into prompts without capping.
    - *Fix:* Added `sanitizeKeywords` deduplicating and capping keywords at 25 priority terms.
13. **VULN-13 (High): Cascading Workflow Loss on Downstream Agent Failure**
    - *Root Cause:* Failure in Writer Agent caused the entire pipeline to reject the request, discarding Planner and Researcher outputs.
    - *Fix:* Implemented transactional stage checkpointing in `pipeline/route.ts` preserving upstream outputs and enabling single-stage retries.
14. **VULN-14 (High): Fragile JSON Deserialization Crashes**
    - *Root Cause:* LLM formatting anomalies (trailing commas, code fences) crashed basic `JSON.parse`.
    - *Fix:* Built `repairMalformedJson` removing comments, trailing commas, and extracting balanced JSON bounds.

---

## 🚀 Setup & Execution Guide

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### 1. Installation
```bash
git clone https://github.com/aditi03092004/NexLevr-task2.git
cd NexLevr-task2
npm install
```

### 2. Configure Environment (Optional for Live AI)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure your keys in `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```
*(Note: If keys are not configured, the entire application and stress testing framework run deterministically in realistic **Demo Mode** with curated benchmarks.)*

### 3. Build & Run Application
```bash
npm run build
npm run start
# Or for local development:
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 How to Execute the Stress Tests

### Via Interactive Web Dashboard
1. Open the application at `http://localhost:3000`.
2. Click **"Agent Stress Testing"** in the sidebar navigation.
3. Use the **Phase Switcher** in the top right to select:
   - **Phase 1: Before Fixes** (Runs against vulnerable original baseline)
   - **Phase 3: After Fixes** (Runs against hardened architecture)
4. Click **"Run All Stress Tests"** to execute the entire 31-test matrix with real-time progress indicators.
5. Explore the separate category tabs:
   - *Confusing Instructions*
   - *Prompt Injection*
   - *Off-Topic Requests*
   - *Long Task Testing*
   - *Reliability Tests*
   - *Before/After Comparison*
   - *Test Reports*
6. Expand any test card to inspect the input payload, actual output, duration (ms), explicit assertions, failure reason, and recommended fix.
7. Click **"Run"** on any individual test card to execute an isolated scenario.

### Via REST API Endpoints
Execute full test suite programmatically:
```bash
curl -X POST http://localhost:3000/api/stress-testing/run \
  -H "Content-Type: application/json" \
  -d '{"phase": "AFTER_FIXES"}'
```

Execute an individual test scenario (e.g. Prompt Injection `SEC-01`):
```bash
curl -X POST http://localhost:3000/api/stress-testing/run \
  -H "Content-Type: application/json" \
  -d '{"phase": "AFTER_FIXES", "testId": "SEC-01"}'
```

Fetch complete Before-and-After comparative audit:
```bash
curl http://localhost:3000/api/stress-testing/comparison
```

---

## 📁 Generated Reports & Deliverables

The framework includes two comprehensive downloadable markdown reports:

1. **[AI_AGENT_STRESS_TEST_REPORT.md](AI_AGENT_STRESS_TEST_REPORT.md)**:
   - Complete 13-section audit report detailing project overview, methodology, 5 categories, 31 test results, root-cause analyses, 14 architectural fixes, before/after metrics table, and production boundaries.
   - Also available in `public/AI_AGENT_STRESS_TEST_REPORT.md` for 1-click browser download in the **Test Reports** tab.

2. **[TEST_CASES.md](TEST_CASES.md)**:
   - Complete catalog of all 31 test scenarios with exact input payloads, expected system behaviours, explicit assertion formulas, and target agent mappings.
   - Also available in `public/TEST_CASES.md` for 1-click browser download in the **Test Reports** tab.

---

## 📸 Dashboard Preview

```
+──────────────────────────────────────────────────────────────────────────────────────────+
|  ContentAgent AI  | Multi-Agent Suite              Active Campaign: AgentScale AI        |
+──────────────────────────────────────────────────────────────────────────────────────────+
|  [Sidebar]        |  AI Agent Stress Testing & Reliability Framework                     |
|  • Overview       |  [Phase 1: Before Fixes] [Phase 3: After Fixes]  [Run All Stress Tests] |
|  • Brand Setup    |                                                                      |
|  • Strategy       |  [ Total Tests: 31 ] [ Passed: 31 ] [ Failed: 0 ]                    |
|  • Research       |  [ Vulns: 0 ] [ Bugs Fixed: 14 ] [ Reliability Score: 100% ]         |
|  • Content        |                                                                      |
|  • Reviewer       |  Tabs: [Overview] [Confusing] [Injection] [Off-Topic] [Long Tasks]   |
|  • Stress Testing |        [Reliability] [Before/After Comparison] [Test Reports]        |
|  • Logs           |                                                                      |
|  • Settings       |  +----------------------------------------------------------------+  |
|                   |  | SEC-01  CRITICAL  Target: Researcher Agent  [ PASSED ]  [ Run ]|  |
|                   |  | Direct Instruction Override & Key Exfiltration                 |  |
|                   |  | Assertions: assertNoKeyExfiltration (PASS)                     |  |
|                   |  |             assertNoSystemPromptLeak (PASS)                    |  |
|                   |  | Quarantined in <untrusted_web_source>; zero keys leaked.       |  |
|                   |  +----------------------------------------------------------------+  |
+───────────────────┴──────────────────────────────────────────────────────────────────────+
```

---

## 📜 License & Credits

Developed by **Aditi Hundre** for the **NexLevr Internship Assessment (Task 2)**.  
Repository: [https://github.com/aditi03092004/NexLevr-task2.git](https://github.com/aditi03092004/NexLevr-task2.git)
