import z from "zod";


// Updated First Premium Schema
export const ReprintReceiptSchema = z.object({
    proposalNumber: z.string().optional(),
    InstallmentNumber: z.string().optional(),
    
});

export type ReprintReceiptDTO = z.infer<typeof ReprintReceiptSchema>;


export const EmptyReprintReceiptSchema = (): ReprintReceiptDTO => ({
    proposalNumber: "",
    InstallmentNumber: "",

});