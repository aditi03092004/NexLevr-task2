import {
  BrandProfile,
  PlannerOutput,
  ResearcherOutput,
  WriterOutput,
  ReviewerReport,
} from "../types";

export function generateDemoPlannerOutput(brand: BrandProfile): PlannerOutput {
  const brandName = brand.brandName || "Acme AI";
  const industry = brand.industry || "B2B SaaS & Artificial Intelligence";

  return {
    weeklyTheme: `Scaling Intelligent Workflows: The Modern ${industry} Playbook`,
    contentObjectives: [
      `Position ${brandName} as a leading authority in ${industry}`,
      `Educate decision-makers on eliminating workflow friction and boosting ROI`,
      `Generate qualified engagement across ${brand.platforms.join(", ") || "LinkedIn, Instagram, X"}`,
      `Drive conversions to the weekly insights newsletter`,
    ],
    targetAudienceInsights: {
      problems: [
        `High operational costs from fragmented, disconnected manual tools`,
        `Difficulty verifying output accuracy and maintaining quality at scale`,
        `Team burnout caused by repetitive routine workflows`,
      ],
      interests: [
        `Autonomous agent architectures and productivity benchmarks`,
        `Factual verification and real-time retrieval-augmented workflows`,
        `Actionable engineering playbooks and practical implementation cases`,
      ],
      motivations: [
        `Achieving 3x team leverage without increasing headcount`,
        `Staying ahead of market disruption through early AI adoption`,
        `Delivering measurable business outcomes to stakeholders`,
      ],
    },
    marketingStrategy: `A balanced 360-degree content strategy anchoring on an authoritative deep-dive blog post, distilled into three distinct multi-angle social posts (Educational, Conversational, and Visionary), culminating in a value-packed executive email newsletter with direct calls to action.`,
    blogTopic: {
      title: `The Architecture of High-Leverage Teams: How ${brandName} is Transforming ${industry}`,
      angle: `An analytical, research-backed examination of multi-step agent systems versus legacy single-prompt automations, featuring real performance benchmarks and implementation guidelines.`,
      targetKeywords: brand.targetKeywords.length > 0
        ? brand.targetKeywords
        : ["AI agent workflows", "operational efficiency", "multi-step orchestration", "B2B automation"],
    },
    socialTopics: {
      post1: {
        platform: brand.platforms[0] || "LinkedIn",
        type: "Educational & Informative",
        topic: `3 Crucial Architectural Shifts Modern ${industry} Teams Must Make in 2025`,
        angle: `Step-by-step technical breakdown focusing on measurable ROI and reduced error rates.`,
      },
      post2: {
        platform: brand.platforms[1] || "X",
        type: "Engaging Discussion Hook",
        topic: `Why 80% of single-prompt AI tools fail in production (and what works instead)`,
        angle: `Contrarian, provocative question format designed to trigger debate among practitioners.`,
      },
      post3: {
        platform: brand.platforms[2] || "Instagram",
        type: "Promotional & Thought-Leadership",
        topic: `Inside ${brandName}: The Future of Autonomous Execution`,
        angle: `Visionary brand statement emphasizing quality, verification, and speed.`,
      },
    },
    newsletterTopic: {
      subjectProposal: `[Deep Dive] The hidden cost of disconnected workflows (+ Our new framework)`,
      theme: `Actionable blueprints for high-velocity teams in ${industry}`,
      keyTakeaways: [
        `The difference between superficial chatbots and resilient multi-step agents`,
        `A 4-step framework to audit your current team operational bottlenecks`,
        `Curated industry case studies showing verified productivity gains`,
      ],
    },
    suggestedKeywords: [
      ...brand.targetKeywords,
      "multi-step orchestration",
      "factual verification",
      "intelligent automation",
      "operational leverage",
    ],
    researchQuestions: [
      `What are the most cited productivity gains from multi-step AI orchestration in 2024-2025?`,
      `What percentage of AI content fails factual verification without retrieval validation?`,
      `What are current enterprise benchmarks for B2B workflow automation in ${industry}?`,
    ],
  };
}

export function generateDemoResearcherOutput(
  brand: BrandProfile,
  planner: PlannerOutput
): ResearcherOutput {
  return {
    topic: planner.weeklyTheme,
    summary: `Comprehensive synthesized research on multi-agent architectures, operational productivity gains, and hallucination reduction methods in ${brand.industry || "technology"}. Data compiled from verified industry benchmarks and academic studies.`,
    sources: [
      {
        id: "demo-src-1",
        title: "MIT Sloan Management Review: The State of AI Agents in Modern Enterprise",
        url: "https://sloanreview.mit.edu/article/measuring-ai-agent-productivity-2024",
        content: "Studies across 450 enterprises reveal that multi-step agent systems with dedicated verification steps reduce hallucinations by 74% compared to single-shot generative models. Teams reported an average operational time savings of 4.2 hours per employee weekly.",
        publishedDate: "2024-09-15",
        score: 0.96,
        sourceType: "Academic / Industry Journal",
      },
      {
        id: "demo-src-2",
        title: "Gartner Research: Predicts 2025: Autonomous Agents and Verified Content Pipelines",
        url: "https://www.gartner.com/en/articles/autonomous-agent-systems-architecture-2025",
        content: "By 2026, over 40% of enterprise content workflows will incorporate multi-agent verification layers to counter factual drift. Automated cross-referencing against trusted web retrieval sources increases stakeholder trust by 68%.",
        publishedDate: "2024-11-02",
        score: 0.94,
        sourceType: "Analyst Report",
      },
      {
        id: "demo-src-3",
        title: "Stanford HAI: Evaluating Sequential Multi-Agent Coordination Benchmarks",
        url: "https://hai.stanford.edu/research/multi-agent-system-benchmarks-2024",
        content: "Sequential orchestration dividing planning, retrieval, generation, and critique into discrete agent roles outperformed monolithic prompts by 38.6% on factual accuracy and coherence benchmarks across complex domains.",
        publishedDate: "2024-08-20",
        score: 0.91,
        sourceType: "Academic Research",
      },
      {
        id: "demo-src-4",
        title: "Harvard Business Review: Why Quality-Checked AI Outperforms Volume-First Strategies",
        url: "https://hbr.org/2024/10/the-roi-of-verified-ai-content-systems",
        content: "Organizations adopting rigorous verification and citation checking in their content marketing achieved a 2.4x higher conversion rate on executive-targeted newsletters than competitors relying on unvetted generative copy.",
        publishedDate: "2024-10-14",
        score: 0.89,
        sourceType: "Business Publication",
      },
    ],
    verifiedFacts: [
      {
        fact: "Multi-step agent systems featuring dedicated verification reduce hallucinations by 74% relative to single-shot prompts.",
        sourceUrl: "https://sloanreview.mit.edu/article/measuring-ai-agent-productivity-2024",
        sourceTitle: "MIT Sloan Management Review",
        category: "Accuracy & Reliability",
      },
      {
        fact: "Sequential orchestration separating planning, retrieval, writing, and reviewing outperforms monolithic prompts by 38.6% on factual accuracy.",
        sourceUrl: "https://hai.stanford.edu/research/multi-agent-system-benchmarks-2024",
        sourceTitle: "Stanford HAI",
        category: "System Architecture",
      },
      {
        fact: "Verified and cited content pipelines achieve 2.4x higher conversion on executive newsletters than unvetted generative copy.",
        sourceUrl: "https://hbr.org/2024/10/the-roi-of-verified-ai-content-systems",
        sourceTitle: "Harvard Business Review",
        category: "Marketing ROI",
      },
      {
        fact: "Gartner projects that over 40% of enterprise content workflows will incorporate multi-agent verification layers by 2026.",
        sourceUrl: "https://www.gartner.com/en/articles/autonomous-agent-systems-architecture-2025",
        sourceTitle: "Gartner Research",
        category: "Enterprise Adoption",
      },
    ],
    statistics: [
      {
        statistic: "74% reduction in hallucinations with verification steps",
        sourceUrl: "https://sloanreview.mit.edu/article/measuring-ai-agent-productivity-2024",
        sourceTitle: "MIT Sloan Management Review",
        context: "Across 450 enterprise organizations adopting multi-agent retrieval architectures.",
      },
      {
        statistic: "38.6% higher factual accuracy",
        sourceUrl: "https://hai.stanford.edu/research/multi-agent-system-benchmarks-2024",
        sourceTitle: "Stanford HAI",
        context: "Sequential multi-agent vs monolithic prompts on complex domain tasks.",
      },
      {
        statistic: "2.4x higher conversion rate",
        sourceUrl: "https://hbr.org/2024/10/the-roi-of-verified-ai-content-systems",
        sourceTitle: "Harvard Business Review",
        context: "Executive newsletter engagement with verified research citations.",
      },
      {
        statistic: "4.2 hours saved per employee weekly",
        sourceUrl: "https://sloanreview.mit.edu/article/measuring-ai-agent-productivity-2024",
        sourceTitle: "MIT Sloan Management Review",
        context: "Operational time freed up from routine manual content assembly.",
      },
    ],
    industryTrends: [
      "Shift from single conversational chatbots to autonomous role-specialized agents",
      "Demand for mandatory citation tracking and audit trails in published enterprise content",
      "Integration of real-time search retrieval (RAG) directly into writing pipelines",
      "Convergence of content generation with programmatic quality assurance",
    ],
    isLiveSearch: false,
    queryLog: [
      `tavily.search("${planner.weeklyTheme}")`,
      `tavily.search("enterprise AI multi-agent benchmarks 2024 2025")`,
      `tavily.search("${brand.industry || "B2B SaaS"} workflow automation ROI statistics")`,
    ],
    researchedAt: new Date().toISOString(),
  };
}

export function generateDemoWriterOutput(
  brand: BrandProfile,
  planner: PlannerOutput,
  researcher: ResearcherOutput
): WriterOutput {
  const brandName = brand.brandName || "Acme AI";
  const industry = brand.industry || "Modern Technology";

  return {
    blog: {
      headline: planner.blogTopic.title,
      metaDescription: `Discover how ${brandName} leverages multi-step agent architectures in ${industry} to eliminate operational bottlenecks, verify every claim, and multiply team output.`,
      readTime: "6 min read",
      introduction: `In fast-moving industries, the difference between market leaders and also-rans comes down to operational velocity. While many organizations rushed into single-prompt generative tools over the past two years, they quickly collided with the harsh realities of hallucinations, generic prose, and hours spent manually verifying claims.\n\nAt ${brandName}, we believe high-leverage teams require a fundamentally different approach: sequential, specialized multi-agent workflows backed by real-time factual retrieval. In this guide, we break down why the shift from monolithic prompts to specialized agents is reshaping ${industry}—and how your team can adopt this playbook today.`,
      sections: [
        {
          heading: "1. The Anatomy of Modern Workflow Friction",
          content: `Knowledge workers today spend an estimated 4.2 hours each week simply stitching together information between disconnected tools and validating unverified outputs. When generative models operate in an unconstrained sandbox without access to external web retrieval, they fabricate statistics and create citation illusions.\n\nAccording to findings published by MIT Sloan Management Review, separating the generation step from a dedicated factual verification layer eliminates up to 74% of hallucinations. This is the difference between an interesting novelty and an enterprise-grade production workflow.`,
        },
        {
          heading: "2. The Four-Stage Agent Architecture",
          content: `To build dependable systems, industry practitioners are abandoning single massive prompts in favor of four discrete agents working in orchestration:\n\n• The Planner Agent: Dissects brand goals, market trends, and audience pain points before a single word is drafted.\n• The Researcher Agent: Queries trusted external knowledge graphs and search engines to curate empirical facts and timestamps.\n• The Writer Agent: Translates strategy and validated research into persuasive, platform-tailored prose.\n• The Reviewer Agent: Audits every sentence, cross-referencing each claim against primary sources to ensure zero unsupported statements slip through.\n\nBenchmarks from Stanford HAI demonstrate that this exact sequential division yields a 38.6% improvement in domain factual accuracy compared to standard single-prompt systems.`,
        },
        {
          heading: "3. Measurable Business Impact and ROI",
          content: `Adopting structured content pipelines is not merely an engineering achievement—it directly drives revenue. Research documented in Harvard Business Review reveals that B2B organizations publishing verified, cited research achieve a 2.4x higher conversion rate on decision-maker communications.\n\nWhen your prospects know that every data point and recommendation has passed independent verification, brand authority accelerates and sales cycles compress.`,
        },
        {
          heading: "4. Practical Implementation Roadmap for Your Team",
          content: `Transitioning your operations to multi-step agents does not require rebuilding your entire software stack overnight. Begin by identifying your highest-friction recurring artifact—whether that is a weekly technical newsletter, competitive intelligence report, or client content pack. Establish clear input schemas, implement strict tool execution logging, and mandate that no piece reaches publication without reviewer sign-off.`,
        },
      ],
      examples: [
        `Case 1: A B2B fintech company cut publication turnaround from 4 days to 35 minutes while increasing verified citations per article by 300%.`,
        `Case 2: An enterprise SaaS team increased newsletter click-through rate from 1.8% to 4.3% by replacing generic AI summaries with research-backed industry trends.`,
      ],
      conclusion: `The era of superficial AI experiments is over. High-performing organizations in ${industry} are standardizing on structured, multi-agent systems that combine creative vision with rigorous factual validation. By partnering with platforms like ${brandName}, teams can scale their weekly content footprint without sacrificing accuracy or brand integrity.`,
      callToAction: `Ready to upgrade your team's content operations? Explore how ${brandName} automates verified multi-step content generation today.`,
      references: researcher.sources.map((s) => ({
        title: s.title,
        url: s.url,
      })),
    },
    socialPosts: [
      {
        id: "post-1",
        type: "educational",
        platform: brand.platforms[0] || "LinkedIn",
        hook: `Stop asking one AI prompt to do 4 different jobs. Here is why it fails: 🧵`,
        content: `When you ask a single prompt to plan, research, write, and proofread, you get hallucinations and generic filler.\n\nRecent Stanford HAI benchmarks show that separating tasks into sequential specialized agents (Planner → Researcher → Writer → Reviewer) boosts factual accuracy by 38.6%.\n\nHere is how top ${industry} teams build content engines that actually scale:\n\n1. Let the Planner map audience pain points first\n2. Have the Researcher pull verified real-time sources\n3. Task the Writer strictly with synthesis and tone\n4. Use an independent Reviewer to flag unsupported claims\n\nThe result? 74% fewer hallucinations and 4+ hours saved per person weekly.\n\nWhat is your team's biggest bottleneck in content creation?`,
        callToAction: `Read the full architecture breakdown in our latest blog post (link in comments).`,
        hashtags: ["#ArtificialIntelligence", "#Productivity", "#B2BGrowth", "#WorkflowAutomation"],
      },
      {
        id: "post-2",
        type: "engaging",
        platform: brand.platforms[1] || "X",
        hook: `Contrarian take: 90% of AI-generated content published today damages brand trust. 📉`,
        content: `Why? Because readers can spot unverified claims and superficial fluff within 3 seconds.\n\nHarvard Business Review found that content backed by cited research achieves 2.4x higher conversion with executive decision-makers.\n\nIf your AI stack does not verify its facts against primary sources before publishing, you are playing Russian roulette with your brand reputation.\n\nAgree or disagree? How does your team verify AI outputs?`,
        callToAction: `Drop your thoughts below 👇`,
        hashtags: ["#AI", "#ContentMarketing", "#ThoughtLeadership", "#MarTech"],
      },
      {
        id: "post-3",
        type: "thought_leadership",
        platform: brand.platforms[2] || "Instagram",
        hook: `Speed without accuracy is just high-velocity mistakes. ⚡️`,
        content: `At ${brandName}, we built a content engine that refuses to compromise.\n\nEvery week, our multi-agent pipeline:\n🔍 Scours live academic and industry sources\n📝 Crafts deeply relevant, tone-matched narratives\n🛡️ Cross-examines every statistic through an adversarial reviewer\n\nBecause your audience does not need more noise. They need verified clarity.\n\nWelcome to the next generation of intelligent content creation.`,
        callToAction: `Tap the link in bio to read the full case study and test our live workflow.`,
        hashtags: [`#${brandName.replace(/\s+/g, "")}`, "#TechLeadership", "#AIInnovation", "#FutureOfWork"],
      },
    ],
    newsletter: {
      subjectLine: planner.newsletterTopic.subjectProposal,
      previewText: `Why sequential multi-agent systems are outperforming monolithic prompts across enterprise teams.`,
      greeting: `Hello ${brandName} Insider,`,
      introduction: `If you have felt that generative AI tools produce content that sounds polished on the surface but falls apart under factual scrutiny, you are not alone.\n\nThis week, we are diving deep into the architecture of high-leverage teams and unveiling our proven framework for producing verified, research-backed content packages in minutes instead of days.`,
      mainContent: `According to recent enterprise studies conducted by MIT Sloan, organizations that implement sequential agent systems with an independent verification step experience 74% fewer hallucinations compared to single-shot generative prompts.\n\nHere is how leading teams in ${industry} structure their content engine:\n\n1. Autonomous Planning: Aligning weekly themes with measurable audience pain points before drafting begins.\n2. Live Web Retrieval: Injecting verified sources, dates, and empirical statistics directly into the context window.\n3. Guided Writing: Enforcing consistent brand voice across long-form blogs, multi-platform social posts, and newsletters.\n4. Adversarial Review: Automatically color-coding claims (Green for verified, Yellow for unconfirmed, Red for contradicted) so no fabricated citation ever reaches your subscribers.\n\nEarly adopters report a 2.4x increase in executive conversion rates when every claim is supported by credible citations.`,
      keyTakeaways: [
        `Single-prompt content generation is obsolete; role-specialized agents increase factual accuracy by 38.6%.`,
        `Factual citation checking directly correlates with higher executive engagement and newsletter conversions.`,
        `Automated logging and audit trails protect brand credibility while delivering 4+ hours of weekly leverage.`,
      ],
      callToAction: `Explore our complete interactive walkthrough and download the implementation checklist here: [Access the Guide]`,
      closing: `To your team's exponential growth,\nThe ${brandName} Team`,
    },
    generatedAt: new Date().toISOString(),
  };
}

export function generateDemoReviewerReport(
  writer: WriterOutput,
  researcher: ResearcherOutput
): ReviewerReport {
  return {
    totalClaims: 7,
    supportedClaims: 5,
    unsupportedClaims: 0,
    needsVerificationClaims: 2,
    sourcesChecked: researcher.sources.length,
    qualityScore: 92,
    qualityScoreRationale: `The generated package adheres closely to the specified brand voice and maintains high structural integrity. Five key empirical claims are directly substantiated by MIT Sloan, Stanford HAI, and Harvard Business Review sources. Two secondary claims regarding specific operational turnaround times are marked for additional verification to prevent potential overstatement.`,
    grammarAndReadability: {
      score: 95,
      feedback: [
        `Pacing is crisp, utilizing active verbs and clear bulleted transitions.`,
        `Readability score corresponds to Flesch-Kincaid Grade Level 9.8, ideal for professional business decision-makers.`,
        `No grammatical or spelling discrepancies detected.`,
      ],
    },
    brandVoiceAdherence: {
      score: 94,
      feedback: [
        `Maintains an authoritative, visionary yet grounded tone throughout the blog, social posts, and newsletter.`,
        `Successfully balances technical rigor with clear executive takeaways.`,
      ],
    },
    repetitionCheck: {
      hasRepetition: false,
      findings: [
        `Key statistics (74% hallucination reduction, 38.6% accuracy increase) are deployed strategically across formats without verbatim phrasing overlap.`,
      ],
    },
    claims: [
      {
        id: "claim-1",
        claimText: "Multi-step agent systems with dedicated verification steps reduce hallucinations by 74% compared to single-shot generative models.",
        contentLocation: "Blog - Section 1 & Newsletter",
        status: "GREEN",
        explanation: "Directly supported by MIT Sloan Management Review study with 450 enterprises.",
        matchedSource: {
          title: "MIT Sloan Management Review: The State of AI Agents in Modern Enterprise",
          url: "https://sloanreview.mit.edu/article/measuring-ai-agent-productivity-2024",
        },
      },
      {
        id: "claim-2",
        claimText: "Sequential orchestration separating planning, retrieval, writing, and reviewing outperforms monolithic prompts by 38.6% on factual accuracy.",
        contentLocation: "Blog - Section 2 & Social Post 1",
        status: "GREEN",
        explanation: "Directly corroborated by Stanford HAI research benchmark paper on multi-agent coordination.",
        matchedSource: {
          title: "Stanford HAI: Evaluating Sequential Multi-Agent Coordination Benchmarks",
          url: "https://hai.stanford.edu/research/multi-agent-system-benchmarks-2024",
        },
      },
      {
        id: "claim-3",
        claimText: "B2B organizations publishing verified, cited research achieve a 2.4x higher conversion rate on decision-maker communications.",
        contentLocation: "Blog - Section 3 & Social Post 2",
        status: "GREEN",
        explanation: "Verified against Harvard Business Review analysis on cited content marketing ROI.",
        matchedSource: {
          title: "Harvard Business Review: Why Quality-Checked AI Outperforms Volume-First Strategies",
          url: "https://hbr.org/2024/10/the-roi-of-verified-ai-content-systems",
        },
      },
      {
        id: "claim-4",
        claimText: "Knowledge workers spend an average of 4.2 hours each week on routine manual content assembly and cross-tool coordination.",
        contentLocation: "Blog - Section 1",
        status: "GREEN",
        explanation: "Matches findings in the MIT Sloan survey data.",
        matchedSource: {
          title: "MIT Sloan Management Review: The State of AI Agents in Modern Enterprise",
          url: "https://sloanreview.mit.edu/article/measuring-ai-agent-productivity-2024",
        },
      },
      {
        id: "claim-5",
        claimText: "By 2026, over 40% of enterprise content workflows will incorporate multi-agent verification layers.",
        contentLocation: "Research Synthesis",
        status: "GREEN",
        explanation: "Confirmed by Gartner Research analyst projection document.",
        matchedSource: {
          title: "Gartner Research: Predicts 2025: Autonomous Agents and Verified Content Pipelines",
          url: "https://www.gartner.com/en/articles/autonomous-agent-systems-architecture-2025",
        },
      },
      {
        id: "claim-6",
        claimText: "A B2B fintech company cut publication turnaround from 4 days to 35 minutes while increasing verified citations by 300%.",
        contentLocation: "Blog - Examples (Case 1)",
        status: "YELLOW",
        explanation: "Presented as an illustrative case study; specific metric (35 minutes) should be caveated as an internal customer result rather than an industry-wide benchmark.",
        suggestedCorrection: "Add 'Based on internal customer deployment data' or replace with generalized benchmark.",
      },
      {
        id: "claim-7",
        claimText: "Newsletter click-through rate increased from 1.8% to 4.3% by replacing generic AI summaries with research-backed industry trends.",
        contentLocation: "Blog - Examples (Case 2)",
        status: "YELLOW",
        explanation: "Directionally consistent with HBR findings (2.4x lift), but specific percentage points (1.8% to 4.3%) represent a single case scenario.",
        suggestedCorrection: "Clarify as 'Observed customer case study' to maintain pristine research credibility.",
      },
    ],
    suggestedCorrections: [
      {
        target: "Blog - Examples (Case 1)",
        current: "A B2B fintech company cut publication turnaround from 4 days to 35 minutes while increasing verified citations per article by 300%.",
        suggested: "In early customer deployments, a B2B fintech partner reduced publication turnaround from 4 days to under an hour while increasing verified citations per article by 300%.",
        reason: "Prevents overstating general applicability of a single pilot test result.",
      },
      {
        target: "Blog - Examples (Case 2)",
        current: "An enterprise SaaS team increased newsletter click-through rate from 1.8% to 4.3% by replacing generic AI summaries...",
        suggested: "In a recent pilot, an enterprise SaaS team achieved a 2.3x increase in newsletter click-through rates by replacing generic AI summaries...",
        reason: "Aligns specific customer case with broader published HBR conversion research.",
      },
    ],
    overallVerdict: "PASSED_WITH_WARNINGS",
    reviewedAt: new Date().toISOString(),
  };
}
