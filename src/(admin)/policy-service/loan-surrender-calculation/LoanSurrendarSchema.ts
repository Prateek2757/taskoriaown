import {z} from "zod";

export const LoanSurrendarSchema = z.object({
    policyId: z.string().optional().nullable(),
    date: z.string().optional().nullable(),
    dateLocal: z.string().optional().nullable(),
})

export type LoanSurrendarDTO = z.infer<typeof LoanSurrendarSchema>;

export const emptyLoanSurrendar: z.infer<typeof LoanSurrendarSchema> = {
    policyId: "",
    date: "",
    dateLocal: "",
};