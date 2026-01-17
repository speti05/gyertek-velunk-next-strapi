import ReactMarkdown from "react-markdown";

import type { TextBlockProps } from "@/types";

export function TextContentBlock({
  content,
}: Readonly<TextBlockProps>) {
  return (
    <section className={`onlyText}`}>
        <ReactMarkdown className="copy">{content}</ReactMarkdown>
    </section>
  );
}