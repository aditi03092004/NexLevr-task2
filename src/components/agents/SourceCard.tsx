import React from "react";
import { ResearchSource } from "@/lib/types";
import { ExternalLink, Calendar, Globe, BookmarkCheck } from "lucide-react";

interface SourceCardProps {
  source: ResearchSource;
  index: number;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source, index }) => {
  let hostname = "";
  try {
    const urlObj = new URL(source.url);
    hostname = urlObj.hostname.replace(/^www\./, "");
  } catch {
    hostname = source.url;
  }

  return (
    <div className="glass-card p-4 rounded-xl border border-zinc-800/80 hover:border-violet-500/40 transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs text-violet-400 font-medium">
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate max-w-[180px]">{hostname}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {source.score !== undefined && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-950/80 text-violet-300 border border-violet-800/50">
                Score: {Math.round(source.score * 100)}%
              </span>
            )}
            <span className="text-[11px] text-zinc-500 font-mono">#{index + 1}</span>
          </div>
        </div>

        <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-violet-300 transition-colors line-clamp-2 mb-2">
          {source.title}
        </h4>

        <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed mb-3">
          {source.content}
        </p>
      </div>

      <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs">
        {source.publishedDate ? (
          <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
            <Calendar className="w-3 h-3" />
            {source.publishedDate}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500/80">
            <BookmarkCheck className="w-3 h-3" /> Verified Index
          </span>
        )}

        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors group-hover:underline"
        >
          <span>Visit Source</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
