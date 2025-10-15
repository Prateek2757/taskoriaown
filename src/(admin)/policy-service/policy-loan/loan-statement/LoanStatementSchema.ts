import { z } from "zod";


export const RepaymentReceiptSchema = z.object({
    loanId: z.string().optional().nullable(),
})
export type RepaymentReceiptFormDTO = z.infer<typeof RepaymentReceiptSchema>;

export const emptyRepaymentReceipt = {
    loanId: "",
}


