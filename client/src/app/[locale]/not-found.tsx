import { getTexts } from "@/i18n/texts";
import { getRequestLocale } from "@/data/locale";
import { ErrorPage } from "@/components/ErrorPage";

export default async function NotFound() {
  const { NOT_FOUND_LABEL, PAGE_NOT_FOUND_LABEL } = getTexts(await getRequestLocale());
  return <ErrorPage title={PAGE_NOT_FOUND_LABEL} description={NOT_FOUND_LABEL} />;
}
