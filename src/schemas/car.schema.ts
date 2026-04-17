import { z } from "zod";

export const carFilterSchema = z.object({
  location: z.string().optional(),
  category: z.enum(["ECONOMY","SUV","LUXURY","ELECTRIC","VAN","PICKUP"]).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
});

export type CarFilter = z.infer<typeof carFilterSchema>;