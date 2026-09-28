import React from "react";
import { ParagraphProps } from "@/types";
import { MarkdownContent } from "@/components/MarkdownContent";

export function Paragraph({ content }: Readonly<ParagraphProps>) {
  return (
    <div className="paragraph-reset copy article-paragraph">
      <MarkdownContent>{content}</MarkdownContent>
    </div>
  );
}
