type TextNode = {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};

type LinkNode = {
  type: "link";
  url: string;
  children: InlineNode[];
};

type InlineNode = TextNode | LinkNode;

type ListItemNode = {
  type: "list-item";
  children: InlineNode[];
};

type BlockNode = {
  type: string;
  level?: number;
  format?: "ordered" | "unordered";
  url?: string;
  alt?: string;
  language?: string;
  children?: (InlineNode | ListItemNode | BlockNode)[];
};

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderInline(node: InlineNode): string {
  if (node.type === "link") {
    const inner = node.children.map(renderInline).join("");
    return `<a href="${node.url}" style="color:#377F76;text-decoration:underline;">${inner}</a>`;
  }

  let text = escapeHtml(node.text);
  if (node.bold) text = `<strong>${text}</strong>`;
  if (node.italic) text = `<em>${text}</em>`;
  if (node.underline) text = `<u>${text}</u>`;
  if (node.strikethrough) text = `<s>${text}</s>`;
  if (node.code)
    text = `<code style="background:#f4f4f4;padding:2px 6px;border-radius:3px;font-family:monospace;font-size:14px;">${text}</code>`;
  return text;
}

function renderBlock(block: BlockNode): string {
  const children = (block.children ?? []) as any[];

  switch (block.type) {
    case "paragraph": {
      const content = children.map(renderInline).join("");
      if (!content.trim()) return "<br>";
      return `<p style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:16px;line-height:26px;margin:0 0 16px;">${content}</p>`;
    }
    case "heading": {
      const level = block.level ?? 2;
      const content = children.map(renderInline).join("");
      const sizeMap: Record<number, string> = {
        1: "28px",
        2: "24px",
        3: "20px",
        4: "18px",
        5: "16px",
        6: "14px",
      };
      const size = sizeMap[level] ?? "20px";
      return `<h${level} style="font-family:'Luckiest Guy',cursive;color:#377F76;font-size:${size};margin:24px 0 12px;font-weight:400;letter-spacing:1px;">${content}</h${level}>`;
    }
    case "list": {
      const items = children
        .map((item: any) => {
          const content = (item.children ?? []).map(renderInline).join("");
          return `<li style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:16px;line-height:26px;margin-bottom:6px;">${content}</li>`;
        })
        .join("");
      const tag = block.format === "ordered" ? "ol" : "ul";
      return `<${tag} style="margin:0 0 16px;padding-left:24px;">${items}</${tag}>`;
    }
    case "quote": {
      const content = children.map(renderInline).join("");
      return `<blockquote style="border-left:4px solid #377F76;margin:16px 0;padding:12px 20px;background:#F1E8D9;font-family:'Source Sans 3',Arial,sans-serif;color:#70634C;font-size:16px;font-style:italic;">${content}</blockquote>`;
    }
    case "code": {
      const content = children.map((c: any) => escapeHtml(c.text ?? "")).join("\n");
      return `<pre style="background:#f4f4f4;padding:16px;border-radius:6px;font-size:14px;overflow-x:auto;margin:0 0 16px;font-family:monospace;white-space:pre-wrap;"><code>${content}</code></pre>`;
    }
    case "image": {
      return `<img src="${block.url}" alt="${block.alt ?? ""}" style="max-width:100%;height:auto;margin:16px 0;display:block;" />`;
    }
    default:
      return "";
  }
}

export function blocksToHtml(blocks: unknown): string {
  if (!blocks) return "";

  let parsed: BlockNode[];
  if (typeof blocks === "string") {
    try {
      parsed = JSON.parse(blocks);
    } catch {
      return `<p style="font-family:'Source Sans 3',Arial,sans-serif;color:#333333;font-size:16px;line-height:26px;">${escapeHtml(blocks)}</p>`;
    }
  } else if (Array.isArray(blocks)) {
    parsed = blocks as BlockNode[];
  } else {
    return "";
  }

  return parsed.map(renderBlock).join("\n");
}
