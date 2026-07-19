import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { slugify } from "@/lib/utils";

/**
 * Single source of truth for rendering blog Markdown. Used by the public post
 * page AND the admin editor preview so "what you write is what you publish".
 */
export function BlogMarkdown({ content }: { content: string }) {
  return (
    <div className="blog-markdown max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={{
          h1: ({ children }) => {
            const id = slugify(String(children));
            return (
              <h1
                id={id}
                className="scroll-mt-24 font-serif text-3xl font-bold text-foreground mt-12 mb-6"
              >
                {children}
              </h1>
            );
          },
          h2: ({ children }) => {
            const id = slugify(String(children));
            return (
              <h2
                id={id}
                className="scroll-mt-24 font-serif text-2xl font-bold text-foreground mt-12 mb-6"
              >
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const id = slugify(String(children));
            return (
              <h3
                id={id}
                className="scroll-mt-24 font-serif text-xl font-bold text-foreground mt-8 mb-4"
              >
                {children}
              </h3>
            );
          },
          h4: ({ children }) => (
            <h4 className="font-serif text-lg font-semibold text-foreground mt-6 mb-3">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-foreground leading-relaxed mb-6">{children}</p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-accent underline underline-offset-2 hover:opacity-80"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          ul: ({ children, className }) => {
            const isTaskList = className?.includes("contains-task-list");
            return (
              <ul
                className={
                  isTaskList
                    ? "mb-6 list-none space-y-2 pl-0 text-foreground"
                    : "mb-6 list-disc space-y-2 pl-6 text-foreground marker:text-accent"
                }
              >
                {children}
              </ul>
            );
          },
          ol: ({ children }) => (
            <ol className="list-decimal space-y-2 mb-6 pl-6 text-foreground marker:text-secondary">
              {children}
            </ol>
          ),
          li: ({ children, className }) => (
            <li
              className={
                className?.includes("task-list-item")
                  ? "flex list-none items-start gap-2 leading-relaxed"
                  : "leading-relaxed"
              }
            >
              {children}
            </li>
          ),
          input: ({ checked, type }) =>
            type === "checkbox" ? (
              <input
                type="checkbox"
                checked={!!checked}
                readOnly
                className="mt-1 h-4 w-4 flex-shrink-0 accent-[var(--accent)]"
              />
            ) : null,
          del: ({ children }) => (
            <del className="text-secondary line-through">{children}</del>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent pl-6 my-6 italic text-secondary">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          hr: () => <hr className="my-10 border-t border-muted-border" />,
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={typeof src === "string" ? src : ""}
              alt={alt ?? ""}
              className="my-6 w-full rounded border border-muted-border"
            />
          ),
          pre: ({ children }) => (
            <pre className="my-6 overflow-x-auto rounded-lg bg-code-bg p-4 text-sm text-code-foreground">
              {children}
            </pre>
          ),
          code: ({ className, children }) => {
            const text = String(children);
            const isBlock = !!className || text.includes("\n");
            if (isBlock) {
              return <code className={`font-mono ${className ?? ""}`}>{children}</code>;
            }
            return (
              <code className="rounded bg-code-bg px-1.5 py-0.5 font-mono text-sm text-accent">
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-muted-border text-left">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 font-semibold text-foreground">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border-b border-muted-border px-3 py-2 text-secondary">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
