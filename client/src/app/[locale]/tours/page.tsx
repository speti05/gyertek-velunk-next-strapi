import { redirect } from "next/navigation";
import { localizedPath } from "@/data/locale";
import { Route } from "@/i18n/config";

export default async function AllEventsRoute() {
  redirect(await localizedPath(Route.Home));
}
