import { z } from "zod";


export const productRateDocument = z.object({
    productRateFile: z.string().optional().nullable(),
  productRateFileName: z.string().optional().nullable(),
})


export const ProductRateSchema = z.object({
    productId: z.string().optional().nullable(),
    productRateFile: z.array(productRateDocument).optional().nullable(),
    age: z.string().optional().nullable(),
    term: z.string().optional().nullable(),
    payingTerm: z.string().optional().nullable(),
    rate: z.string().optional().nullable(),
    isActive: z.boolean().optional().nullable(),
});





export type ProductRateDTO = z.infer<typeof ProductRateSchema>;


export const emptyProductRate: ProductRateDTO = {
    productId: "",
    age: "",
    term: "",
    payingTerm: "",
    rate: "",
    isActive: false,
};