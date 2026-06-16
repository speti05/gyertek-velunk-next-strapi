import { ContactRequestForm } from "@/components/ContactRequestForm";
import { ContactRequestBlockProps } from "@/types";

export function ContactRequestBlock({ title, subtitlePrefix, subtitleSuffix, link }: ContactRequestBlockProps) {
  return <ContactRequestForm title={title} subtitlePrefix={subtitlePrefix} subtitleSuffix={subtitleSuffix} link={link} />;
}
