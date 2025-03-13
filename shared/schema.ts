import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const gameFilters = z.object({
  genres: z.array(z.string()).default(["indie"]),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minRating: z.number().min(0).max(100).optional(),
  minReviews: z.number().min(0).optional(),
  maxReviews: z.number().optional(),
  minReleaseYear: z.coerce.number().min(1990).max(2030).optional(),
  independentOnly: z.boolean().optional(),
});

export type GameFilters = z.infer<typeof gameFilters>;

export interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  ratings_count: number;
  released: string;
  genres: Array<{id: number; name: string}>;
  description: string;
  price?: number;
  developers?: Array<{id: number; name: string}>;
}