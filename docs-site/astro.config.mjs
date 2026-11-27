import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

const REPO = "https://github.com/speti05/gyertek-velunk-next-strapi";

// GitHub Pages serves a project site under /<repo-name>/
export default defineConfig({
  site: "https://speti05.github.io",
  base: "/gyertek-velunk-next-strapi",
  integrations: [
    starlight({
      title: "Gyertek Velünk – Súgó",
      defaultLocale: "root",
      locales: {
        root: { label: "Magyar", lang: "hu" },
      },
      social: [{ icon: "github", label: "GitHub", href: REPO }],
      editLink: { baseUrl: `${REPO}/edit/main/docs-site/` },
      sidebar: [
        { label: "Fiók", autogenerate: { directory: "fiok" } },
        { label: "Hírlevél", autogenerate: { directory: "hirlevel" } },
        { label: "Kapcsolatfelvétel", autogenerate: { directory: "kapcsolat" } },
        { label: "Tesztlefedettség", link: "/lefedettseg/" },
      ],
    }),
  ],
});
