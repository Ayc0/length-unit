import { defineCollection, z } from "astro:content";
import { docsSchema } from "@astrojs/starlight/schema";

export const collections = {
  docs: defineCollection({
    schema: docsSchema({
      extend: z.object({
        createdAt: z.date().optional(),
        image: z.string().optional(),
      }),
    }),
  }),
};
