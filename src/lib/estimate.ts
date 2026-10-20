import { z } from "zod";

export const estimateSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  location: z.string().trim().min(1).max(200),
  bedrooms: z.enum(["Studio", "1", "2", "3", "4+"]),
  propertyType: z.enum(["Flat", "House", "Other"]),
  alreadyListed: z.enum(["Yes", "No"]),
  listingLinkOrPhone: z.string().trim().max(500).optional().default(""),
  notes: z.string().trim().max(2000).optional().default(""),
  website: z.string().max(500).optional().default(""),
});

export type EstimateInput = z.infer<typeof estimateSchema>;
export const estimateRateLimited = (count: number) => count >= 3;

export function estimateEmailRows(data: EstimateInput, timestamp: string): [string, string][] {
  return [
    ["Name", data.name], ["Email", data.email], ["Property location", data.location],
    ["Bedrooms", data.bedrooms], ["Property type", data.propertyType],
    ["Already listed on Airbnb", data.alreadyListed],
    ["Airbnb listing link or phone number", data.listingLinkOrPhone || "(none)"],
    ["Message", data.notes || "(none)"], ["Submitted", timestamp],
  ];
}