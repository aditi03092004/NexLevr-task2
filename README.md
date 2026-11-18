# 🚀 Multi-Step AI Content Agent

An enterprise-grade, autonomous **Multi-Step AI Content Generation & Factual Verification Platform** powered by **Google Gemini**, **Tavily Search API**, **Next.js 14**, and **Tailwind CSS**.

Built as a professional internship project for **NexLevr**, this application solves the primary failure mode of single-prompt AI tools—hallucinations, unverified claims, and disconnected workflows—by orchestrating **four specialized autonomous agents** in sequence with strict tool-call logging and adversarial fact-checking.

---

## 🌟 Key Highlights

- **4 Specialized Autonomous Agents**:
  1. 🧭 **Planner Agent**: Analyzes brand identity, audience pain points, and marketing goals to architect a weekly theme, content strategy, and delegated research targets.
  2. 🔍 **Researcher Agent**: Conducts live web research via the **Tavily Search API**, compiling real primary source URLs, publication timestamps, empirical statistics, and industry trends without inventing data.
  3. ✍️ **Writer Agent**: Combines strategic angles with verified research to craft a comprehensive content package:
     - **1 Anchor Blog Article** (SEO headline, metadata, structured sections, case studies, CTA, clickable source references).
     - **3 Multi-Platform Social Media Posts** (Educational, Engaging Discussion Hook, and Thought Leadership tailored for LinkedIn, X, and Instagram).
     - **1 Executive Email Newsletter** (Subject proposal, preview text, greeting, body, key takeaways, and closing).
  4. 🛡️ **Reviewer Agent**: Acts as an independent adversarial auditor. Scans every generated draft, extracts empirical claims, cross-examines each against the collected primary research, assigns color-coded statuses (**GREEN** / **YELLOW** / **RED**), checks brand voice adherence, and scores overall content quality (0–100).
- **Tool-Call Telemetry & Audit Trail**: Deterministic logging of every API invocation, search query, claim verification step, latency duration (ms), input/output payload, and error trace.
- **Fail-Safe Orchestration & Retries**: Allows running the entire sequential pipeline end-to-end or stepping through individual agents with stage-level retries without losing previously completed work.
- **Transparent Demo Mode**: When API keys are not supplied, the platform runs in a clearly marked **Demo Mode** backed by vetted research archives (MIT Sloan, Stanford HAI, Gartner, HBR). Demo results are never disguised as live research.
- **Data Portability**: Full persistence across page refreshes via LocalStorage, with JSON export/import and one-click Markdown/TXT downloads.

---

## 🏛️ Multi-Agent Architecture

```
                                  [ User Input Dashboard ]
                                             │
                                             ▼
                                  ┌──────────────────────┐
                                  │    Planner Agent     │
                                  │ (Theme, Plan, Goals) │
                                  └──────────┬───────────┘
                                             │
                                             ▼
                                  ┌──────────────────────┐
                                  │   Researcher Agent   │
                                  │(Tavily Live Web RAG) │
                                  └──────────┬───────────┘
                                             │
                                             ▼
                                  ┌──────────────────────┐
                                  │     Writer Agent     │
                                  │(Blog, Social, Email) │
                                  └──────────┬───────────┘
                                             │
                                             ▼
                                  ┌──────────────────────┐
                                  │    Reviewer Agent    │
                                  │(Fact-Check & Audit)  │
                                  └──────────┬───────────┘
                                             │
                                             ▼
                              [ Final Verified Content Pack ]
                                  (Blog • Social • Email)
```

### The 4 Agents at Work

| Agent | Core Responsibility | Primary Tool / Input | Deliverables |
|---|---|---|---|
| **Planner Agent** | Market intelligence & content theme architecture | Brand Profile + Audience Pain Points | Weekly Theme, Audience Insights (Problems, Interests, Motivations), Blog Angle, 3 Social Angles, Newsletter Proposal, Research Targets |
| **Researcher Agent** | Live web retrieval & factual fact extraction | Tavily Search API (`POST /search`) | Curated Primary Sources with URLs & dates, Verified Facts, Quantitative Statistics, Industry Trends, Search Query Telemetry |
| **Writer Agent** | Multi-channel synthesis & tone-matching | Strategy + Empirical Research | Long-form Blog Article, 3 Social Media Posts (LinkedIn, X, Instagram), Executive Email Newsletter |
| **Reviewer Agent** | Adversarial fact-checking & quality audit | Drafts vs Collected Source Documents | 0–100 Quality Score, Claim Badges (**GREEN**, **YELLOW**, **RED**), Line-by-Line Correction Suggestions, Readability & Brand Voice Scoring |

---

## 🛡️ Factual Claim Verification Standard

The Reviewer Agent evaluates every factual claim against the collected research material:

- 🟢 **GREEN (Supported)**: The claim is directly corroborated by primary sources in the research dossier. Clickable citations and titles are provided.
- 🟡 **YELLOW (Needs Additional Verification)**: The claim is directionally plausible or represents an isolated case result, but lacks direct corroborating primary research in the current retrieval set. A caution or caveat is recommended.
- 🔴 **RED (Unsupported / Flagged)**: The claim is contradicted by research, cites non-existent sources, or represents a generative hallucination. Immediate revision is required.

---

## 💻 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Icons**: Lucide Icons
- **Backend**: Next.js API Routes (`/api/agents/*`, `/api/check-keys`)
- **AI Model**: Google Gemini (`@google/generative-ai`)
- **Search Retrieval**: Tavily Search API
- **Persistence**: LocalStorage with versioned JSON backup / restore
- **Styling**: Charcoal/Black dark theme (`#07080d`), purple/violet accents, glassmorphic panels

---

## 📁 Project Folder Structure

```
├── .env.example                # Sample environment variables
├── .gitignore                  # Git ignore rules
├── next.config.mjs             # Next.js configuration
├── package.json                # Dependencies and scripts
├── postcss.config.mjs          # PostCSS configuration
├── tailwind.config.ts          # Tailwind CSS theme and dark palette
├── tsconfig.json               # TypeScript configuration
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── agents/
│   │   │   │   ├── pipeline/route.ts     # End-to-end sequential orchestrator
│   │   │   │   ├── planner/route.ts      # Planner agent endpoint
│   │   │   │   ├── researcher/route.ts   # Researcher agent endpoint (Tavily)
│   │   │   │   ├── writer/route.ts       # Writer agent endpoint
│   │   │   │   └── reviewer/route.ts     # Reviewer agent endpoint
│   │   │   └── check-keys/route.ts       # Safe server-side API key health check
│   │   ├── globals.css                   # Custom scrollbars and glassmorphism styles
│   │   ├── layout.tsx                    # Root HTML layout and metadata
│   │   └── page.tsx                      # Main dashboard controller and reactive state
│   ├── components/
│   │   ├── agents/
│   │   │   ├── ClaimBadge.tsx            # Color-coded Green/Yellow/Red badge
│   │   │   ├── QualityScoreGauge.tsx     # Quality score progress bar and audit metrics
│   │   │   └── SourceCard.tsx            # Clickable source card with URLs and dates
│   │   ├── dashboard/
│   │   │   ├── OverviewTab.tsx           # Platform analytics and deliverable summary
│   │   │   ├── BrandSetupTab.tsx         # User input form with 1-click presets
│   │   │   ├── StrategyTab.tsx           # Planner agent strategy panel
│   │   │   ├── ResearchTab.tsx           # Researcher agent sources & statistics panel
│   │   │   ├── ContentTab.tsx            # Writer agent outputs (Blog, Social, Email)
│   │   │   ├── ReviewerTab.tsx           # Reviewer agent audit & claim verification
│   │   │   ├── LogsTab.tsx               # Tool execution logs with JSON inspection
│   │   │   └── SettingsTab.tsx           # API key status, demo toggle, and backups
│   │   └── layout/
│   │       ├── AgentStatusBar.tsx        # Live 4-agent sequential workflow stepper
│   │       ├── Header.tsx                # Action header with key status and pipeline trigger
│   │       └── Sidebar.tsx               # Navigation sidebar with campaign switcher
│   └── lib/
│       ├── agents/
│       │   ├── planner.ts                # Planner Agent logic & prompt schemas
│       │   ├── researcher.ts             # Researcher Agent logic (Tavily + Gemini)
│       │   ├── writer.ts                 # Writer Agent logic (Blog, Social, Newsletter)
│       │   └── reviewer.ts               # Reviewer Agent logic & adversarial audit
│       ├── services/
│       │   ├── demoData.ts               # Vetted demo archives for keyless testing
│       │   ├── gemini.ts                 # Google Gemini SDK service wrapper
│       │   └── tavily.ts                 # Tavily Search API client
│       ├── storage/
│       │   └── campaignStore.ts          # LocalStorage persistence & campaign manager
│       ├── types/
│       │   └── index.ts                  # Shared TypeScript interfaces & types
│       └── utils/
│           ├── export.ts                 # Markdown, TXT, and full pack exporters
│           └── logger.ts                 # Tool execution logging helpers & filters
```

---

## ⚙️ Installation & Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/aditi03092004/NexLevr-task1.git
cd NexLevr-task1
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your API keys:
```env
# Google Gemini API Key (Get free key at: https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=AIzaSy...your_gemini_api_key_here

# Tavily AI Search API Key (Get 1,000 free searches/month at: https://tavily.com)
TAVILY_API_KEY=tvly-...your_tavily_api_key_here

# Optional: Default AI Model (defaults to gemini-1.5-flash)
GEMINI_MODEL=gemini-1.5-flash
```

> 🔒 **Security Notice**: API keys are accessed **only on the server** inside Next.js API routes (`src/app/api/...`). No secret is ever leaked to the browser bundle.

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing the 4 Agents

### Testing Without API Keys (Demo Mode)
If you don't have API keys immediately available:
1. Open the app at `http://localhost:3000`.
2. Notice the **DEMO** badge in the sidebar and the **Demo Mode: ON** button in the header.
3. Click **"Generate Content Pack"** on the Overview tab.
4. Watch the 4 agents execute in sequence:
   - **Planner Agent** designs a strategy for *AgentScale AI*.
   - **Researcher Agent** loads curated empirical research from MIT Sloan and Stanford HAI.
   - **Writer Agent** drafts the blog, 3 social posts, and newsletter.
   - **Reviewer Agent** audits the 7 claims, tagging 5 as GREEN and 2 as YELLOW with suggested caveats.
5. All tool executions are deterministically recorded in the **Tool Execution Logs** tab.

### Testing With Live API Keys
1. Add your keys to `.env.local` and restart `npm run dev`.
2. The header indicators will display **Gemini Live** and **Tavily Live** in green.
3. Select any quick-start template on the **Brand Setup** tab (e.g., *Sustainable Eco-Commerce* or *Enterprise Cybersecurity*).
4. Click **"Generate Content Pack"**.
5. The Researcher Agent will make actual live web requests to Tavily, pull the latest 2024–2025 sources, and the Reviewer Agent will cross-check the generated copy in real time.

---

## 📸 Dashboard Walkthrough

1. **Overview Dashboard**: High-level campaign metrics, live agent status, and deliverable summaries.
2. **Brand Setup Panel**: 1-click industry templates, audience targeting, tone selection, and platform picker.
3. **Content Strategy Panel**: Weekly theme hero card, audience pain-point mapping, and research targets.
4. **Research Dossier**: Clickable source cards with primary URLs, empirical statistics, and search telemetry.
5. **Generated Content Hub**:
   - In-place editable Blog Article with Markdown and TXT download.
   - 3 platform-tailored Social Posts (Educational, Engaging, Thought Leadership) with copy buttons.
   - Professional Executive Email Newsletter.
6. **Reviewer Audit Panel**: Circular quality score gauge, claim-by-claim Green/Yellow/Red cards, and line-by-line editorial suggestions.
7. **Tool Execution Logs**: Detailed table of every tool invocation, latency in ms, status filters, and JSON modal inspection.
8. **Settings & Environment**: Live credential checks, demo mode switcher, and JSON data backup/restore.

---

## 📜 License & Credits

Developed by **Aditi Hundre** for the **NexLevr Internship Assignment**.  
Powered by Next.js, Google Gemini, and Tavily Search.
