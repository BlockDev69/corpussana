import { file, glob } from "astro/loaders"
import { z } from "astro/zod"
import { defineCollection } from "astro:content"

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    image: z.string().optional(), // Optional: for the carousel card
    color: z.enum(["blue", "orange", "green"]).optional() // Optional: for the accent
  })
})

export const collections = { articles }
