import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/articles' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(), // tidak wajib; default = filename
    date: z.coerce.date(),
    description: z.string(),
    hero: z.string().optional(), // path gambar, relatif ke /public
    heroAlt: z.string().default(''),
    tags: z.array(z.string()).default([]),
    status: z.enum(['draft', 'published']).default('draft'),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

export const collections = { articles };
