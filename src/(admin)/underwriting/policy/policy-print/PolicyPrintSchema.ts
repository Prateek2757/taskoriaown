import z from "zod";


// Updated First Premium Schema
export const PolicyPrintSchema = z.object({
    proposalNumber: z.string().optional(),
    InstallmentNumber: z.string().optional(),
    
});

export type PolicyPrintDTO = z.infer<typeof PolicyPrintSchema>;


export const EmptyPolicyPrintSchema = (): PolicyPrintDTO => ({
    proposalNumber: "",
    InstallmentNumber: "",

});