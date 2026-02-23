import ReactMarkdown from "react-markdown";

import type { TextBlockProps } from "@/types";

export function TextContentBlock({
  content,
}: Readonly<TextBlockProps>) {
  return (
    <div className="container">
      <section className={`onlyText}`}>
          <ReactMarkdown className="copy">{content}</ReactMarkdown>
      </section>
    </div>
  );
}