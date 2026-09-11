import { file } from "astro/loaders"
import { z } from "astro/zod"
import { defineCollection } from "astro:content"

const articles = defineCollection({
  loader: file("src/content/article.json"),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    author: z.string(),
    summary: z.string(),
    date: z.string(),
    image: z.string().optional(), // Optional: for the carousel card
    color: z.enum(["blue", "orange", "green"]).optional() // Optional: for the accent
  })
})

export const collections = { articles }
