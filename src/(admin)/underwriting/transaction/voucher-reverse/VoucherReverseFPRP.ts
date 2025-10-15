import z from "zod";


// Updated First Premium Schema
export const VoucherReverseSchema = z.object({
    PolicyNumber: z.string().optional(),
    VoucherNo: z.string().optional(),
    
});

export type VoucherReverseDTO = z.infer<typeof VoucherReverseSchema>;


export const EmptyVoucherReverseSchema = (): VoucherReverseDTO => ({
    PolicyNumber: "",
    VoucherNo: "",

});