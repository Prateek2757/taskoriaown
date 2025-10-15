import { z } from "zod";


export const RepaymentReceiptSchema = z.object({
    receiptNo: z.string().optional().nullable(),
    help:z.string().optional().nullable(),
    test:z.string().optional().nullable(),
})
export type RepaymentReceiptFormDTO = z.infer<typeof RepaymentReceiptSchema>;

export const emptyRepaymentReceipt = {
    receiptNo: "",
    
}


