import z from "zod";



// Updated First Premium Schema
export const RenualPremiumSchema = z.object({
    // policyNumber: z.string().optional(),
    collectionType: z.string().min(1, "Collection Type is required"),
    
    excessAmount: z.string().optional(),
    isPartialPayment: z.boolean().optional(),
    proposalNumber: z.string().optional(),
    payer: z.string().optional(),
    bankName: z.string().optional(),
});

export type RenualPremiumDTO = z.infer<typeof RenualPremiumSchema>;

export const emptyRenualPremium = (): RenualPremiumDTO => ({
    collectionType: "",
    excessAmount: "0",
    isPartialPayment: false,
    proposalNumber: "",
    payer: "",
    bankName: "",
});