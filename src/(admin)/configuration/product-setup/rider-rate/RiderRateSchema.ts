import { z } from "zod";


export const RiderRateDocument = z.object({
    RiderRateFile :z.string().optional().nullable(),
    RiderRateFileName :z.string().optional().nullable(),
})


export const RiderRateSchema = z.object({
    productId: z.string().optional().nullable(),
    riderId: z.string().optional().nullable(),
    minAge: z.string().optional().nullable(),
    maxAge: z.string().optional().nullable(),
    riderMinTerm: z.string().optional().nullable(),
    riderMaxTerm: z.string().optional().nullable(),
    minPremiumTerm: z.string().optional().nullable(),
    maxPremiumTerm: z.string().optional().nullable(),
    premiumRate: z.string().optional().nullable(),
    minSa: z.string().optional().nullable(),
    RiderRate:z.array(RiderRateDocument).optional().nullable(),
    maxSa: z.string().optional().nullable(),
    isActive: z.boolean().default(false),
});


export type RiderRateDTO = z.infer<typeof RiderRateSchema>;

export const emptyRiderRate = {
    productId: '',
    riderId: '',
    minAge: '',
    riderMinTerm: '',
    riderMaxTerm: '',
    minPremiumTerm: '',
    maxPremiumTerm: '',
    premiumRate: '',
    minSa: '',
    maxSa: '',
    isActive: false,
}