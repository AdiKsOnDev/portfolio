/**
 * remark plugin: turn GitHub-style alert blockquotes into admonition blocks.
 *
 *   > [!NOTE]
 *   > Some note content
 *
 * becomes a <div class="admonition admonition-note"> with a title, instead of a
 * plain blockquote. Supported types: NOTE, TIP, IMPORTANT, WARNING, CAUTION.
 */

const TITLES: Record<string, string> = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution",
};

const MARKER = /^\[!(note|tip|important|warning|caution)\][ \t]*(?:\n|$)/i;

interface MdNode {
  type: string;
  value?: string;
  children?: MdNode[];
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
  };
}

function transform(blockquote: MdNode): void {
  const firstParagraph = blockquote.children?.[0];
  if (!firstParagraph || firstParagraph.type !== "paragraph") return;

  const firstText = firstParagraph.children?.[0];
  if (!firstText || firstText.type !== "text" || !firstText.value) return;

  const match = firstText.value.match(MARKER);
  if (!match) return;

  const type = match[1].toLowerCase();

  // drop the "[!TYPE]" marker (and its trailing newline) from the content
  firstText.value = firstText.value.slice(match[0].length);

  // if that leaves the first paragraph empty (marker was on its own line with a
  // blank line before the body), remove it entirely
  if (firstParagraph.children!.every((c) => c.type === "text" && !c.value)) {
    blockquote.children!.shift();
  }

  const title: MdNode = {
    type: "paragraph",
    data: { hName: "div", hProperties: { className: ["admonition-title"] } },
    children: [{ type: "text", value: TITLES[type] }],
  };
  blockquote.children!.unshift(title);

  blockquote.data = blockquote.data || {};
  blockquote.data.hName = "div";
  blockquote.data.hProperties = { className: ["admonition", `admonition-${type}`] };
}

function walk(node: MdNode): void {
  if (!node.children) return;
  for (const child of node.children) {
    if (child.type === "blockquote") transform(child);
    walk(child);
  }
}

export function remarkAdmonitions() {
  return (tree: MdNode) => walk(tree);
}
