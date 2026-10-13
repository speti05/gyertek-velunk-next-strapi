import { MarkdownContent } from "@/components/MarkdownContent";

import type { TextBlockProps } from "@/types";

export function TextContentBlock({ content }: Readonly<TextBlockProps>) {
  return (
    <div className="container">
      <section className={`onlyText`}>
        <MarkdownContent className="paragraph-reset copy">{content}</MarkdownContent>
      </section>
    </div>
  );
}
