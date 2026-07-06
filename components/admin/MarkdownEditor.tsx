"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link2,
  Image as ImageIcon,
  List,
  ListOrdered,
  ListChecks,
  Table,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  SquareCode,
  Minus,
  PenLine,
  Columns2,
  Eye,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { BlogMarkdown } from "@/components/blog/BlogMarkdown";

interface Edit {
  value: string;
  start: number;
  end: number;
}

/* --- pure text transforms: (value, selStart, selEnd) -> new value + selection --- */

function wrap(v: string, s: number, e: number, before: string, after: string, ph: string): Edit {
  const sel = v.slice(s, e) || ph;
  const value = v.slice(0, s) + before + sel + after + v.slice(e);
  const start = s + before.length;
  return { value, start, end: start + sel.length };
}

function linePrefix(
  v: string,
  s: number,
  e: number,
  make: (i: number) => string,
  toggle = true
): Edit {
  const lineStart = v.lastIndexOf("\n", s - 1) + 1;
  let lineEnd = v.indexOf("\n", e);
  if (lineEnd === -1) lineEnd = v.length;
  const lines = v.slice(lineStart, lineEnd).split("\n");
  const allPrefixed =
    toggle && lines.every((ln) => ln.startsWith(make(0).trimEnd()));
  const out = lines
    .map((ln, i) => {
      const prefix = make(i);
      if (allPrefixed) {
        return ln.replace(new RegExp(`^${prefix.trimEnd()}\\s?`), "");
      }
      return prefix + ln;
    })
    .join("\n");
  const value = v.slice(0, lineStart) + out + v.slice(lineEnd);
  return { value, start: lineStart, end: lineStart + out.length };
}

function link(v: string, s: number, e: number): Edit {
  const sel = v.slice(s, e) || "text";
  const insert = `[${sel}](url)`;
  const value = v.slice(0, s) + insert + v.slice(e);
  const urlStart = s + 1 + sel.length + 2;
  return { value, start: urlStart, end: urlStart + 3 };
}

function image(v: string, s: number, e: number): Edit {
  const sel = v.slice(s, e) || "alt";
  const insert = `![${sel}](url)`;
  const value = v.slice(0, s) + insert + v.slice(e);
  const urlStart = s + 2 + sel.length + 2;
  return { value, start: urlStart, end: urlStart + 3 };
}

function block(v: string, s: number, e: number, text: string): Edit {
  const before = s > 0 && v[s - 1] !== "\n" ? "\n" : "";
  const after = e < v.length && v[e] !== "\n" ? "\n" : "";
  const insert = before + text + after;
  const value = v.slice(0, s) + insert + v.slice(e);
  const start = s + before.length;
  return { value, start, end: start + text.length };
}

function codeBlock(v: string, s: number, e: number): Edit {
  const sel = v.slice(s, e) || "code";
  return block(v, s, e, "```\n" + sel + "\n```");
}

function table(v: string, s: number, e: number): Edit {
  return block(v, s, e, "| Column | Column |\n| --- | --- |\n| Cell | Cell |");
}

type View = "write" | "split" | "preview";

export function MarkdownEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const pending = useRef<[number, number] | null>(null);
  const [view, setView] = useState<View>("split");
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (pending.current && ref.current) {
      const [s, e] = pending.current;
      ref.current.focus();
      ref.current.setSelectionRange(s, e);
      pending.current = null;
    }
  }, [value]);

  useEffect(() => {
    if (!fullscreen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [fullscreen]);

  const apply = useCallback(
    (fn: (v: string, s: number, e: number) => Edit) => {
      const ta = ref.current;
      if (!ta) return;
      const { value: nv, start, end } = fn(value, ta.selectionStart, ta.selectionEnd);
      pending.current = [start, end];
      onChange(nv);
    },
    [value, onChange]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const mod = e.metaKey || e.ctrlKey;
    const k = e.key.toLowerCase();
    if (mod && k === "b") {
      e.preventDefault();
      apply((v, s, en) => wrap(v, s, en, "**", "**", "bold"));
    } else if (mod && k === "i") {
      e.preventDefault();
      apply((v, s, en) => wrap(v, s, en, "*", "*", "italic"));
    } else if (mod && k === "k") {
      e.preventDefault();
      apply(link);
    } else if (mod && k === "e") {
      e.preventDefault();
      apply((v, s, en) => wrap(v, s, en, "`", "`", "code"));
    } else if (e.key === "Tab") {
      e.preventDefault();
      apply((v, s) => ({ value: v.slice(0, s) + "  " + v.slice(s), start: s + 2, end: s + 2 }));
    }
  };

  // Each tool carries a PURE transform (no ref access), so the array is safe to
  // build during render; the textarea ref is only read inside `apply`, invoked
  // from the inline onClick below.
  type EditFn = (v: string, s: number, e: number) => Edit;
  type Tool =
    | { sep: true }
    | { icon: typeof Bold; title: string; fn: EditFn };

  const tools: Tool[] = [
    { icon: Heading1, title: "Heading 1", fn: (v, s, e) => linePrefix(v, s, e, () => "# ") },
    { icon: Heading2, title: "Heading 2", fn: (v, s, e) => linePrefix(v, s, e, () => "## ") },
    { icon: Heading3, title: "Heading 3", fn: (v, s, e) => linePrefix(v, s, e, () => "### ") },
    { sep: true },
    { icon: Bold, title: "Bold  (⌘B)", fn: (v, s, e) => wrap(v, s, e, "**", "**", "bold") },
    { icon: Italic, title: "Italic  (⌘I)", fn: (v, s, e) => wrap(v, s, e, "*", "*", "italic") },
    { icon: Strikethrough, title: "Strikethrough", fn: (v, s, e) => wrap(v, s, e, "~~", "~~", "text") },
    { icon: Code, title: "Inline code  (⌘E)", fn: (v, s, e) => wrap(v, s, e, "`", "`", "code") },
    { sep: true },
    { icon: Link2, title: "Link  (⌘K)", fn: link },
    { icon: ImageIcon, title: "Image", fn: image },
    { icon: Quote, title: "Quote", fn: (v, s, e) => linePrefix(v, s, e, () => "> ") },
    { icon: List, title: "Bullet list", fn: (v, s, e) => linePrefix(v, s, e, () => "- ") },
    { icon: ListOrdered, title: "Numbered list", fn: (v, s, e) => linePrefix(v, s, e, (i) => `${i + 1}. `, false) },
    { icon: ListChecks, title: "Task list", fn: (v, s, e) => linePrefix(v, s, e, () => "- [ ] ") },
    { sep: true },
    { icon: SquareCode, title: "Code block", fn: codeBlock },
    { icon: Table, title: "Table", fn: table },
    { icon: Minus, title: "Divider", fn: (v, s, e) => block(v, s, e, "---") },
  ];

  const views: { id: View; icon: typeof Eye; title: string }[] = [
    { id: "write", icon: PenLine, title: "Write" },
    { id: "split", icon: Columns2, title: "Split" },
    { id: "preview", icon: Eye, title: "Preview" },
  ];

  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-[60] flex flex-col bg-background"
          : "border border-muted-border"
      }
    >
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-muted-border bg-muted px-2 py-1.5">
        {tools.map((t, i) =>
          "fn" in t ? (
            <button
              key={i}
              type="button"
              title={t.title}
              onClick={() => apply(t.fn)}
              className="flex h-8 w-8 items-center justify-center text-secondary hover:bg-background hover:text-accent"
            >
              <t.icon className="h-4 w-4" />
            </button>
          ) : (
            <span key={i} className="mx-1 h-5 w-px bg-muted-border" />
          )
        )}
        <div className="ml-auto flex items-center gap-1">
          {views.map((v) => (
            <button
              key={v.id}
              type="button"
              title={v.title}
              onClick={() => setView(v.id)}
              className={`flex h-8 w-8 items-center justify-center ${
                view === v.id
                  ? "text-accent"
                  : "text-secondary hover:text-foreground"
              }`}
            >
              <v.icon className="h-4 w-4" />
            </button>
          ))}
          <span className="mx-1 h-5 w-px bg-muted-border" />
          <button
            type="button"
            title={fullscreen ? "Exit fullscreen  (Esc)" : "Fullscreen"}
            onClick={() => setFullscreen((f) => !f)}
            className="flex h-8 w-8 items-center justify-center text-secondary hover:text-accent"
          >
            {fullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* body */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 ${
          fullscreen ? "min-h-0 flex-1" : "h-[calc(100vh-14rem)] min-h-[28rem]"
        }`}
      >
        {view !== "preview" && (
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck
            placeholder={"# Heading\n\nWrite your post in Markdown…"}
            className={`h-full w-full resize-none bg-background p-4 font-mono text-sm leading-relaxed text-foreground focus:outline-none ${
              view === "write" ? "md:col-span-2" : "border-r border-muted-border"
            }`}
          />
        )}
        {view !== "write" && (
          <div
            className={`h-full overflow-y-auto bg-card p-4 ${
              view === "preview" ? "md:col-span-2" : ""
            }`}
          >
            <BlogMarkdown content={value || "*Nothing to preview yet.*"} />
          </div>
        )}
      </div>
    </div>
  );
}
