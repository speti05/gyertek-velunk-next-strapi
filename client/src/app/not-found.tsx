import { ErrorPage } from "@/components/ErrorPage";
import { NOT_FOUND_LABEL, PAGE_NOT_FOUND_LABEL } from "@/utils/texts";

export default function NotFound() {
  return <ErrorPage title={PAGE_NOT_FOUND_LABEL} description={NOT_FOUND_LABEL} />;
}
