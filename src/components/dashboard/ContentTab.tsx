import React, { useState } from "react";
import { Campaign, WriterOutput, BlogArticle } from "@/lib/types";
import {
  PenTool,
  FileText,
  Share2,
  Mail,
  Copy,
  Check,
  Download,
  Edit3,
  Save,
  RotateCcw,
  ExternalLink,
  Clock,
  Sparkles,
  ArrowRight,
  Eye,
} from "lucide-react";
import { formatBlogToMarkdown, formatBlogToText, triggerDownload } from "@/lib/utils/export";

interface ContentTabProps {
  campaign: Campaign;
  onUpdateWriterOutput: (updated: WriterOutput) => void;
  onRunWriter: () => void;
  onProceedToReviewer: () => void;
  isGenerating: boolean;
}

export const ContentTab: React.FC<ContentTabProps> = ({
  campaign,
  onUpdateWriterOutput,
  onRunWriter,
  onProceedToReviewer,
  isGenerating,
}) => {
  const writer = campaign.writerOutput;
  const brandName = campaign.brand.brandName || "Brand";

  const [activeSubTab, setActiveSubTab] = useState<"blog" | "social" | "newsletter">("blog");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // In-place blog editor state
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [blogDraft, setBlogDraft] = useState<BlogArticle | null>(writer ? writer.blog : null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveBlogEdit = () => {
    if (!writer || !blogDraft) return;
    const updated: WriterOutput = {
      ...writer,
      blog: blogDraft,
    };
    onUpdateWriterOutput(updated);
    setIsEditingBlog(false);
  };

  const handleDownloadBlogMd = () => {
    if (!writer) return;
    const md = formatBlogToMarkdown(writer.blog, brandName);
    const fname = `${brandName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_blog.md`;
    triggerDownload(fname, md, "text/markdown");
  };

  const handleDownloadBlogTxt = () => {
    if (!writer) return;
    const txt = formatBlogToText(writer.blog, brandName);
    const fname = `${brandName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_blog.txt`;
    triggerDownload(fname, txt, "text/plain");
  };

  if (!writer) {
    return (
      <div className="glass-panel p-12 rounded-2xl border border-zinc-800 text-center max-w-2xl mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
          <PenTool className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Content Package Not Yet Generated</h3>
        <p className="text-xs text-zinc-400 mb-6 max-w-md mx-auto">
          The Writer Agent integrates the Planner's strategic angles with the Researcher's verified
          empirical facts to craft a complete weekly package: 1 in-depth blog, 3 social posts, and 1 newsletter.
        </p>
        <button
          onClick={onRunWriter}
          disabled={isGenerating || !campaign.plannerOutput || !campaign.researcherOutput}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-lg inline-flex items-center gap-2 ${
            !campaign.plannerOutput || !campaign.researcherOutput
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 shadow-purple-900/40"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Writer Agent</span>
        </button>
        {(!campaign.plannerOutput || !campaign.researcherOutput) && (
          <p className="text-[11px] text-amber-400/80 mt-2">
            * Complete Strategy and Web Research stages first.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-purple-500/20">
        {/* Sub-tab pills */}
        <div className="flex items-center gap-1.5 bg-[#0b0e1b] p-1.5 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveSubTab("blog")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === "blog"
                ? "bg-violet-600 text-white shadow-md shadow-violet-900/40"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Blog Article</span>
          </button>

          <button
            onClick={() => setActiveSubTab("social")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === "social"
                ? "bg-violet-600 text-white shadow-md shadow-violet-900/40"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Social Posts ({writer.socialPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("newsletter")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === "newsletter"
                ? "bg-violet-600 text-white shadow-md shadow-violet-900/40"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Newsletter</span>
          </button>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRunWriter}
            disabled={isGenerating}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 transition-colors flex items-center gap-1.5"
            title="Regenerate All Content Pieces"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Regenerate Content</span>
          </button>

          <button
            onClick={onProceedToReviewer}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-900/30"
          >
            <span>Review Factual Claims</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: BLOG ARTICLE */}
      {activeSubTab === "blog" && (
        <div className="space-y-6">
          {/* Blog Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d101c] p-3 rounded-xl border border-zinc-800 text-xs">
            <div className="flex items-center gap-3 text-zinc-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-violet-400" />
                {writer.blog.readTime}
              </span>
              <span>•</span>
              <span>{writer.blog.sections.length} Organized Sections</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">
                {writer.blog.references.length} Verified References
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (isEditingBlog) {
                    handleSaveBlogEdit();
                  } else {
                    setBlogDraft(writer.blog);
                    setIsEditingBlog(true);
                  }
                }}
                className="px-3 py-1.5 rounded-lg font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors flex items-center gap-1.5"
              >
                {isEditingBlog ? (
                  <>
                    <Save className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Save Edits</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Article</span>
                  </>
                )}
              </button>

              <button
                onClick={() =>
                  handleCopy(
                    formatBlogToMarkdown(writer.blog, brandName),
                    "blog-copy"
                  )
                }
                className="px-3 py-1.5 rounded-lg font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors flex items-center gap-1.5"
              >
                {copiedId === "blog-copy" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadBlogMd}
                className="px-3 py-1.5 rounded-lg font-semibold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .MD</span>
              </button>

              <button
                onClick={handleDownloadBlogTxt}
                className="px-3 py-1.5 rounded-lg font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>.TXT</span>
              </button>
            </div>
          </div>

          {/* Blog Content Viewer / Editor */}
          <article className="glass-panel p-6 sm:p-10 rounded-2xl border border-zinc-800/80 space-y-8">
            {/* Headline */}
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-violet-400 block mb-2">
                SEO Anchor Article
              </span>
              {isEditingBlog ? (
                <input
                  type="text"
                  value={blogDraft?.headline || ""}
                  onChange={(e) =>
                    blogDraft && setBlogDraft({ ...blogDraft, headline: e.target.value })
                  }
                  className="w-full bg-[#0a0d17] border border-violet-500 rounded-lg p-2 text-xl font-bold text-white focus:outline-none"
                />
              ) : (
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                  {writer.blog.headline}
                </h1>
              )}

              {/* Meta description */}
              <div className="mt-3 p-3 rounded-lg bg-[#0c101d] border border-zinc-800/80 text-xs text-zinc-400">
                <span className="font-bold text-zinc-300 uppercase tracking-wider text-[10px] block mb-0.5">
                  Search Engine Meta Description:
                </span>
                {writer.blog.metaDescription}
              </div>
            </div>

            {/* Introduction */}
            <div className="border-t border-zinc-800/60 pt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Introduction
              </h3>
              {isEditingBlog ? (
                <textarea
                  rows={5}
                  value={blogDraft?.introduction || ""}
                  onChange={(e) =>
                    blogDraft && setBlogDraft({ ...blogDraft, introduction: e.target.value })
                  }
                  className="w-full bg-[#0a0d17] border border-violet-500 rounded-lg p-3 text-xs text-zinc-200 focus:outline-none"
                />
              ) : (
                <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line space-y-3 font-normal">
                  {writer.blog.introduction}
                </div>
              )}
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {writer.blog.sections.map((section, idx) => (
                <div key={idx} className="border-t border-zinc-800/60 pt-6">
                  {isEditingBlog ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={blogDraft?.sections[idx]?.heading || ""}
                        onChange={(e) => {
                          if (!blogDraft) return;
                          const updatedSec = [...blogDraft.sections];
                          updatedSec[idx].heading = e.target.value;
                          setBlogDraft({ ...blogDraft, sections: updatedSec });
                        }}
                        className="w-full bg-[#0a0d17] border border-violet-500 rounded-lg p-2 text-sm font-bold text-white focus:outline-none"
                      />
                      <textarea
                        rows={6}
                        value={blogDraft?.sections[idx]?.content || ""}
                        onChange={(e) => {
                          if (!blogDraft) return;
                          const updatedSec = [...blogDraft.sections];
                          updatedSec[idx].content = e.target.value;
                          setBlogDraft({ ...blogDraft, sections: updatedSec });
                        }}
                        className="w-full bg-[#0a0d17] border border-violet-500 rounded-lg p-3 text-xs text-zinc-200 focus:outline-none"
                      />
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span className="text-violet-400 font-mono text-sm">#{idx + 1}</span>
                        <span>{section.heading}</span>
                      </h2>
                      <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line space-y-3 font-normal">
                        {section.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Practical Examples */}
            {writer.blog.examples && writer.blog.examples.length > 0 && (
              <div className="border-t border-zinc-800/60 pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3">
                  Practical Case Examples
                </h3>
                <div className="space-y-2">
                  {writer.blog.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="bg-[#0c101d] p-3 rounded-lg border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed"
                    >
                      {ex}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conclusion & CTA */}
            <div className="border-t border-zinc-800/60 pt-6 space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Conclusion
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed">{writer.blog.conclusion}</p>
              </div>

              <div className="bg-gradient-to-r from-violet-950/60 to-purple-950/40 p-4 rounded-xl border border-violet-500/30">
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300 block mb-1">
                  Call To Action
                </span>
                <p className="text-xs font-semibold text-white">{writer.blog.callToAction}</p>
              </div>
            </div>

            {/* References */}
            {writer.blog.references && writer.blog.references.length > 0 && (
              <div className="border-t border-zinc-800/60 pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Verified Research Citations & Source URLs
                </h3>
                <div className="space-y-2">
                  {writer.blog.references.map((ref, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 text-xs bg-[#0b0e1a] p-2.5 rounded-lg border border-zinc-800/60"
                    >
                      <span className="text-zinc-200 font-medium line-clamp-1">{ref.title}</span>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-400 hover:text-violet-300 flex items-center gap-1 font-semibold shrink-0"
                      >
                        <span>Source Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      )}

      {/* SUB-TAB 2: THREE SOCIAL POSTS */}
      {activeSubTab === "social" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {writer.socialPosts.map((post, index) => {
              const fullPostText = `${post.hook}\n\n${post.content}\n\n${post.callToAction}\n\n${post.hashtags.join(" ")}`;
              const charCount = fullPostText.length;

              const typeBadge = {
                educational: {
                  label: "Post 1 • Educational",
                  color: "bg-sky-500/20 text-sky-300 border-sky-500/30",
                },
                engaging: {
                  label: "Post 2 • Discussion Hook",
                  color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
                },
                thought_leadership: {
                  label: "Post 3 • Thought Leadership",
                  color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
                },
              }[post.type] || {
                label: `Post ${index + 1}`,
                color: "bg-zinc-800 text-zinc-300 border-zinc-700",
              };

              return (
                <div
                  key={post.id || index}
                  className="glass-panel p-5 rounded-2xl border border-zinc-800/80 flex flex-col justify-between hover:border-violet-500/40 transition-all duration-200"
                >
                  <div>
                    {/* Top Meta */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${typeBadge.color}`}
                      >
                        {typeBadge.label}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#0b0e1a] border border-zinc-700 text-zinc-300">
                        {post.platform}
                      </span>
                    </div>

                    {/* Hook */}
                    <div className="p-2.5 rounded-lg bg-[#0e1322] border border-zinc-800 text-xs font-bold text-violet-300 mb-3">
                      "{post.hook}"
                    </div>

                    {/* Body */}
                    <div className="text-xs text-zinc-300 whitespace-pre-line leading-relaxed mb-4">
                      {post.content}
                    </div>

                    {/* Call to action */}
                    <div className="text-[11px] text-zinc-400 font-semibold mb-3">
                      <span className="text-violet-400">CTA:</span> {post.callToAction}
                    </div>

                    {/* Hashtags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.hashtags.map((h, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom copy row */}
                  <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {charCount} characters
                    </span>

                    <button
                      onClick={() => handleCopy(fullPostText, `post-${index}`)}
                      className="px-3 py-1.5 rounded-lg font-semibold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 transition-colors flex items-center gap-1.5"
                    >
                      {copiedId === `post-${index}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Post</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: EMAIL NEWSLETTER */}
      {activeSubTab === "newsletter" && (
        <div className="space-y-6">
          {/* Email Preview Header */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-zinc-800/80 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Weekly Executive Newsletter
              </span>

              <button
                onClick={() => {
                  const nl = writer.newsletter;
                  const text = `Subject: ${nl.subjectLine}\nPreview: ${nl.previewText}\n\n${nl.greeting}\n\n${nl.introduction}\n\n${nl.mainContent}\n\nKey Takeaways:\n${nl.keyTakeaways.map((t) => `- ${t}`).join("\n")}\n\n${nl.callToAction}\n\n${nl.closing}`;
                  handleCopy(text, "nl-copy");
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 transition-colors flex items-center gap-1.5"
              >
                {copiedId === "nl-copy" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Newsletter</span>
                  </>
                )}
              </button>
            </div>

            {/* Subject and Preview text */}
            <div className="space-y-2 bg-[#0c101d] p-4 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-zinc-400 w-24 shrink-0">Subject Line:</span>
                <span className="text-white font-semibold">{writer.newsletter.subjectLine}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-zinc-400 w-24 shrink-0">Preview Snippet:</span>
                <span className="text-zinc-300">{writer.newsletter.previewText}</span>
              </div>
            </div>

            {/* Email Body Simulation */}
            <div className="max-w-2xl mx-auto bg-[#090c16] p-6 sm:p-8 rounded-xl border border-zinc-800 space-y-4 text-xs sm:text-sm text-zinc-300">
              <p className="font-semibold text-white">{writer.newsletter.greeting}</p>
              <p className="leading-relaxed whitespace-pre-line">{writer.newsletter.introduction}</p>
              <div className="leading-relaxed whitespace-pre-line border-t border-zinc-800/60 pt-4">
                {writer.newsletter.mainContent}
              </div>

              {/* Key takeaways box */}
              <div className="bg-[#101426] p-4 rounded-xl border border-violet-500/30 space-y-2 my-4">
                <span className="text-xs font-bold text-violet-300 uppercase tracking-wider block">
                  Key Takeaways For Your Team
                </span>
                <ul className="space-y-1.5 text-xs text-zinc-200">
                  {writer.newsletter.keyTakeaways.map((takeaway, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-violet-400 font-bold">✓</span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 font-medium text-violet-400">
                {writer.newsletter.callToAction}
              </div>

              <div className="pt-4 border-t border-zinc-800/80 text-xs text-zinc-400 whitespace-pre-line">
                {writer.newsletter.closing}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
