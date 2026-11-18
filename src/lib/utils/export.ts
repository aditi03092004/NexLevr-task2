import { Campaign, BlogArticle, WriterOutput } from "../types";

/**
 * Convert BlogArticle to clean Markdown format
 */
export function formatBlogToMarkdown(blog: BlogArticle, brandName: string): string {
  let md = `# ${blog.headline}\n\n`;
  md += `*Brand: ${brandName} | Estimated Read Time: ${blog.readTime}*\n\n`;
  md += `> **Meta Description:** ${blog.metaDescription}\n\n`;
  md += `---\n\n`;
  md += `## Introduction\n\n${blog.introduction}\n\n`;

  for (const section of blog.sections || []) {
    md += `## ${section.heading}\n\n${section.content}\n\n`;
  }

  if (blog.examples && blog.examples.length > 0) {
    md += `## Case Studies & Practical Applications\n\n`;
    for (const ex of blog.examples) {
      md += `- ${ex}\n`;
    }
    md += `\n`;
  }

  md += `## Conclusion\n\n${blog.conclusion}\n\n`;
  md += `**Take Action:** ${blog.callToAction}\n\n`;

  if (blog.references && blog.references.length > 0) {
    md += `---\n\n### References & Verified Research\n\n`;
    for (const ref of blog.references) {
      md += `- [${ref.title}](${ref.url})\n`;
    }
  }

  return md;
}

/**
 * Convert BlogArticle to plain text format
 */
export function formatBlogToText(blog: BlogArticle, brandName: string): string {
  let txt = `${blog.headline.toUpperCase()}\n`;
  txt += `Brand: ${brandName} | Read Time: ${blog.readTime}\n`;
  txt += `Meta Description: ${blog.metaDescription}\n`;
  txt += `==========================================================\n\n`;
  txt += `INTRODUCTION\n\n${blog.introduction}\n\n`;

  for (const section of blog.sections || []) {
    txt += `${section.heading.toUpperCase()}\n\n${section.content}\n\n`;
  }

  if (blog.examples && blog.examples.length > 0) {
    txt += `PRACTICAL EXAMPLES\n\n`;
    for (const ex of blog.examples) {
      txt += `* ${ex}\n`;
    }
    txt += `\n`;
  }

  txt += `CONCLUSION\n\n${blog.conclusion}\n\n`;
  txt += `CALL TO ACTION\n${blog.callToAction}\n\n`;

  if (blog.references && blog.references.length > 0) {
    txt += `REFERENCES:\n`;
    for (const ref of blog.references) {
      txt += `- ${ref.title}: ${ref.url}\n`;
    }
  }

  return txt;
}

/**
 * Export complete campaign content pack as Markdown
 */
export function formatCompletePackToMarkdown(campaign: Campaign): string {
  const { brand, plannerOutput, researcherOutput, writerOutput, reviewerReport } = campaign;
  const brandName = brand.brandName || "Brand";

  let md = `# Weekly Content Package: ${brandName}\n`;
  md += `*Campaign Period: ${brand.campaignPeriod} | Industry: ${brand.industry} | Generated: ${new Date(campaign.createdAt).toLocaleDateString()}*\n\n`;
  md += `---\n\n`;

  // Strategy Summary
  if (plannerOutput) {
    md += `## 1. Content Strategy Overview\n\n`;
    md += `**Weekly Theme:** ${plannerOutput.weeklyTheme}\n\n`;
    md += `**Strategic Positioning:** ${plannerOutput.marketingStrategy}\n\n`;
    md += `**Target Objectives:**\n`;
    for (const obj of plannerOutput.contentObjectives || []) {
      md += `- ${obj}\n`;
    }
    md += `\n---\n\n`;
  }

  // Blog Article
  if (writerOutput?.blog) {
    md += `## 2. Blog Article\n\n`;
    md += formatBlogToMarkdown(writerOutput.blog, brandName);
    md += `\n\n---\n\n`;
  }

  // Social Media Posts
  if (writerOutput?.socialPosts && writerOutput.socialPosts.length > 0) {
    md += `## 3. Social Media Campaign\n\n`;
    writerOutput.socialPosts.forEach((post, i) => {
      md += `### Post ${i + 1} (${post.platform} - ${post.type})\n\n`;
      md += `**Hook:** ${post.hook}\n\n`;
      md += `${post.content}\n\n`;
      md += `**CTA:** ${post.callToAction}\n\n`;
      md += `**Hashtags:** ${post.hashtags.join(" ")}\n\n`;
      md += `---\n\n`;
    });
  }

  // Email Newsletter
  if (writerOutput?.newsletter) {
    const nl = writerOutput.newsletter;
    md += `## 4. Email Newsletter\n\n`;
    md += `**Subject Line:** ${nl.subjectLine}\n`;
    md += `**Preview Text:** ${nl.previewText}\n\n`;
    md += `**Greeting:** ${nl.greeting}\n\n`;
    md += `${nl.introduction}\n\n`;
    md += `${nl.mainContent}\n\n`;
    md += `**Key Takeaways:**\n`;
    for (const item of nl.keyTakeaways || []) {
      md += `- ${item}\n`;
    }
    md += `\n**CTA:** ${nl.callToAction}\n\n`;
    md += `${nl.closing}\n\n`;
    md += `---\n\n`;
  }

  // Reviewer Audit Summary
  if (reviewerReport) {
    md += `## 5. Reviewer Agent Verification Audit\n\n`;
    md += `**Overall Quality Score:** ${reviewerReport.qualityScore}/100 (${reviewerReport.overallVerdict})\n\n`;
    md += `**Audit Rationale:** ${reviewerReport.qualityScoreRationale}\n\n`;
    md += `**Claims Breakdown:**\n`;
    md += `- Total Claims: ${reviewerReport.totalClaims}\n`;
    md += `- Supported (GREEN): ${reviewerReport.supportedClaims}\n`;
    md += `- Needs Verification (YELLOW): ${reviewerReport.needsVerificationClaims}\n`;
    md += `- Unsupported / Flagged (RED): ${reviewerReport.unsupportedClaims}\n`;
    md += `- Credible Sources Checked: ${reviewerReport.sourcesChecked}\n\n`;

    if (reviewerReport.claims && reviewerReport.claims.length > 0) {
      md += `### Claim Fact-Checking Details\n\n`;
      for (const claim of reviewerReport.claims) {
        md += `- **[${claim.status}]** "${claim.claimText}"\n`;
        md += `  - *Location:* ${claim.contentLocation}\n`;
        md += `  - *Audit Finding:* ${claim.explanation}\n`;
        if (claim.matchedSource) {
          md += `  - *Supporting Source:* [${claim.matchedSource.title}](${claim.matchedSource.url})\n`;
        }
        if (claim.suggestedCorrection) {
          md += `  - *Suggested Correction:* ${claim.suggestedCorrection}\n`;
        }
      }
      md += `\n`;
    }
  }

  // Research Sources
  if (researcherOutput?.sources && researcherOutput.sources.length > 0) {
    md += `## 6. Curated Research Sources\n\n`;
    for (const src of researcherOutput.sources) {
      md += `- **${src.title}**\n  URL: ${src.url}\n  ${src.publishedDate ? `Published: ${src.publishedDate} | ` : ""}Snippet: ${src.content.substring(0, 180)}...\n\n`;
    }
  }

  return md;
}

/**
 * Trigger file download in browser
 */
export function triggerDownload(filename: string, content: string, mimeType = "text/markdown"): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
