import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";

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

const components: Components = {
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
    <ReactMarkdown className={className} components={components}>
      {children}
    </ReactMarkdown>
  );
}
