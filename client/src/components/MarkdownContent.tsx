import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown, { type Components, type Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import { palette } from "@/sass/base/colors.generated";

// Strapi's rich-text link button wraps the selected text as [text](link) and leaves
// "link" as the href until the editor types in the real address, which they rarely do.
const PLACEHOLDER_HREF = "link";

const ABSOLUTE_URL = /^https?:\/\/\S+$/i;
const BARE_DOMAIN = /^(www\.)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function textOf(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child);
      if (isValidElement<{ children?: ReactNode }>(child)) return textOf(child.props.children);
      return "";
    })
    .join("");
}

// When the href is still the placeholder, the link text itself is the address.
function resolveHref(href: string | undefined, text: string): string | undefined {
  if (href && href.trim().toLowerCase() !== PLACEHOLDER_HREF) return href;

  const candidate = text.trim();
  if (ABSOLUTE_URL.test(candidate)) return candidate;
  if (EMAIL.test(candidate)) return `mailto:${candidate}`;
  if (BARE_DOMAIN.test(candidate)) return `https://${candidate}`;
  return undefined;
}

// Minimal mdast shape the underline plugin needs - keeps @types/mdast out of the deps.
interface MdNode {
  type: string;
  value?: string;
  children?: MdNode[];
  data?: { hName?: string };
}

const UNDERLINE_OPEN = /^<u>$/i;
const UNDERLINE_CLOSE = /^<\/u>$/i;

const isHtmlTag = (node: MdNode, tag: RegExp) =>
  node.type === "html" && tag.test(node.value?.trim() ?? "");

// Strapi's underline button wraps the selection in raw <u>...</u>, which markdown has
// no syntax for. Rendering raw HTML would let any CMS markup through, so only this
// one tag pair is turned into an underline node; everything else stays escaped.
function wrapUnderlines(node: MdNode): void {
  const children = node.children;
  if (!children) return;

  for (let i = 0; i < children.length; i++) {
    if (!isHtmlTag(children[i], UNDERLINE_OPEN)) continue;

    const closeIndex = children.findIndex((child, j) => j > i && isHtmlTag(child, UNDERLINE_CLOSE));
    if (closeIndex === -1) continue;

    // A phrasing node renamed via hName is emitted as <u> in the HTML tree
    children.splice(i, closeIndex - i + 1, {
      type: "emphasis",
      data: { hName: "u" },
      children: children.slice(i + 1, closeIndex),
    });
  }

  children.forEach(wrapUnderlines);
}

function remarkUnderline() {
  return (tree: MdNode) => wrapUnderlines(tree);
}

// singleTilde off: Strapi's strikethrough button writes ~~text~~, while a lone "~" is
// common in copy ("~5 km") and must not strike out the text between two of them.
const remarkPlugins: Options["remarkPlugins"] = [[remarkGfm, { singleTilde: false }], remarkUnderline];

// Minimal hast shape the list plugin needs - keeps @types/hast out of the deps.
interface HtmlNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HtmlNode[];
}

type ListKind = "unordered" | "ordered";

// A list item cannot see its parent while rendering, so tag every direct <li> with the
// kind of list it sits in and, for ordered lists, its number (honouring "3. ..." starts).
function tagListItems(node: HtmlNode): void {
  if (node.type === "element" && (node.tagName === "ul" || node.tagName === "ol")) {
    const listKind: ListKind = node.tagName === "ul" ? "unordered" : "ordered";
    let index = Number(node.properties?.start ?? 1);

    for (const child of node.children ?? []) {
      if (child.type !== "element" || child.tagName !== "li") continue;
      child.properties = { ...child.properties, dataListKind: listKind, dataListIndex: index++ };
    }
  }

  node.children?.forEach(tagListItems);
}

function rehypeListItems() {
  return (tree: HtmlNode) => tagListItems(tree);
}

const rehypePlugins: Options["rehypePlugins"] = [rehypeListItems];

const HIKER_ICON_PATH =
  "M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2m4 5.28c-1.23-.37-2.22-1.17-2.8-2.18l-1-1.6c-.41-.65-1.11-1-1.84-1-.78 0-1.59.5-1.78 1.44S7 23 7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3c1 1.15 2.41 2.01 4 2.34V23H19V9h-1.5zM7.43 13.13l-2.12-.41c-.54-.11-.9-.63-.79-1.17l.76-3.93c.21-1.08 1.26-1.79 2.34-1.58l1.16.23z";

function HikerIcon() {
  return (
    <svg className="markdown-list__marker" viewBox="0 0 24 24" aria-hidden="true">
      <path fill={palette.darkGreen} d={HIKER_ICON_PATH} />
    </svg>
  );
}

// The global reset in _typography.scss pins font-style and font-weight on every
// element, so each Strapi toolbar format needs its own class to show up at all.
const components: Components = {
  ul({ children }) {
    return <ul className="markdown-list markdown-list--unordered">{children}</ul>;
  },
  ol({ start, children }) {
    return (
      <ol className="markdown-list markdown-list--ordered" start={start}>
        {children}
      </ol>
    );
  },
  li({ node, children }) {
    const listKind = node?.properties.dataListKind as ListKind | undefined;

    return (
      <li className="markdown-list__item">
        {listKind === "unordered" && <HikerIcon />}
        {listKind === "ordered" && (
          <span className="markdown-list__marker markdown-list__number" aria-hidden="true">
            {String(node?.properties.dataListIndex)}
          </span>
        )}
        <div className="markdown-list__content">{children}</div>
      </li>
    );
  },
  // Fenced code (```) arrives as <pre><code>; the block styles live on <pre>
  pre({ children }) {
    return <pre className="markdown-code-block">{children}</pre>;
  },
  code({ children }) {
    return <code className="markdown-code">{children}</code>;
  },
  strong({ children }) {
    return <strong className="markdown-bold">{children}</strong>;
  },
  em({ children }) {
    return <em className="markdown-italic">{children}</em>;
  },
  u({ children }) {
    return <u className="markdown-underline">{children}</u>;
  },
  del({ children }) {
    return <del className="markdown-strikethrough">{children}</del>;
  },
  blockquote({ children }) {
    return <blockquote className="markdown-quote">{children}</blockquote>;
  },
  a({ href, children }) {
    const resolvedHref = resolveHref(href, textOf(children));

    // Placeholder link around text that is not an address - nowhere to send the reader
    if (!resolvedHref) return <>{children}</>;

    const isExternal = /^https?:\/\//i.test(resolvedHref);

    return (
      <a
        href={resolvedHref}
        className="markdown-link"
        {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {children}
      </a>
    );
  },
};

interface MarkdownContentProps {
  children: string;
  className?: string;
}

export function MarkdownContent({ children, className }: Readonly<MarkdownContentProps>) {
  return (
    <ReactMarkdown
      className={className}
      components={components}
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
    >
      {children}
    </ReactMarkdown>
  );
}
