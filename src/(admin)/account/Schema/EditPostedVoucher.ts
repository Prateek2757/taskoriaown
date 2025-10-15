import z from "zod";


// Updated First Premium Schema
export const EditPostedVoucherSchema = z.object({
    PolicyNumber: z.string().optional(),
    VoucherNo: z.string().optional(),
    
});

export type EditPostedVoucherDTO = z.infer<typeof EditPostedVoucherSchema>;


export const EmptyEditPostedVoucherSchema = (): EditPostedVoucherDTO => ({
    PolicyNumber: "",
    VoucherNo: "",

});