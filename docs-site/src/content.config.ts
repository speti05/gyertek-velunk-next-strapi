import { defineCollection, z } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        // Use case IDs this page documents - matched to the @UC-... tags of the e2e tests
        usecases: z.array(z.string().regex(/^UC-[A-Z0-9]+-\d+$/)).optional(),
      }),
    }),
  }),
};
