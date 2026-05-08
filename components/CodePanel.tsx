import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CodePanelProps = {
  title: string;
  language: string;
  code: string;
  accent?: "green" | "blue";
  compileStatus?: string;
  className?: string;
};

function highlightLine(line: string) {
  const trimmed = line.trim();
  if (trimmed.startsWith("#") || trimmed.startsWith("//")) {
    return (
      <span className="text-highlight-dim/45">
        {line}
        {"\n"}
      </span>
    );
  }
  const jsx: ReactNode[] = [];
  const tokens = line.split(/(\s+|[{}()\[\];,.:]|".*?"|'.*?'|`.*?`)/g);
  let i = 0;
  for (const part of tokens) {
    if (!part) continue;
    let el: ReactNode = part;
    if (/^(class|def|let|const|return|for|while|if|else|import|from|in|not|and|or|self)$/.test(part))
      el = <span className="text-volt-purple">{part}</span>;
    else if (/^(True|False|None|true|false|null)$/.test(part))
      el = <span className="text-neon-green">{part}</span>;
    else if (/^\d+$/.test(part))
      el = <span className="text-electric-blue">{part}</span>;
    else if (/^["'`].*["'`]$/.test(part))
      el = <span className="text-highlight-dim/80">{part}</span>;
    jsx.push(<span key={i++}>{el}</span>);
  }
  return (
    <>
      {jsx}
      {"\n"}
    </>
  );
}

export function CodePanel({
  title,
  language,
  code,
  accent = "green",
  compileStatus,
  className,
}: CodePanelProps) {
  const lines = code.split("\n");
  const bar =
    accent === "blue"
      ? "from-electric-blue/80 to-volt-purple/60"
      : "from-neon-green/80 to-electric-blue/50";

  return (
    <div
      className={cn(
        "ks-panel corner-bolt flex min-h-[280px] flex-col overflow-hidden rounded-xl md:min-h-[320px]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-neon-green/10 bg-black/40 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-red-500/90" />
            <span className="size-2.5 rounded-full bg-amber-400/90" />
            <span className="size-2.5 rounded-full bg-emerald-500/90" />
          </span>
          <span className="text-xs font-semibold tracking-wide text-white">
            {title}
          </span>
        </div>
        <span
          className={cn(
            "rounded-sm bg-gradient-to-r px-2 py-0.5 font-mono text-[10px] font-semibold text-white uppercase",
            bar,
          )}
        >
          {language}
        </span>
      </div>
      <div className="relative flex min-h-0 flex-1 overflow-auto font-mono text-[11px] leading-relaxed md:text-xs">
        <div className="sticky left-0 top-0 z-[1] select-none border-r border-neon-green/5 bg-black/55 px-2 py-3 text-right text-highlight-dim/30">
          {lines.map((_, idx) => (
            <div key={idx} className="tabular-nums">
              {idx + 1}
            </div>
          ))}
        </div>
        <pre className="flex-1 whitespace-pre-wrap p-3 text-highlight/90">
          {lines.map((line, idx) => (
            <span key={idx}>{highlightLine(line)}</span>
          ))}
        </pre>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-dark to-transparent"
          aria-hidden
        />
      </div>
      {compileStatus && (
        <div className="border-t border-neon-green/10 bg-black/30 px-3 py-1.5 text-xs text-neon-green">
          {compileStatus}
        </div>
      )}
    </div>
  );
}
