import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    excerpt: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { stories };
