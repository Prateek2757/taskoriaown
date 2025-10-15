
import z from "zod";
export const IncomeStatementSchema=z.object({
    date: z.string().optional(),
    dateLocal: z.string().min(1, "Select Branch"),
    todate: z.string().min(1, "Select Ledger"),
    todateLocal: z.string().optional(),
    branch: z.string().optional(),
    branchWise: z.string().optional(),
})


export type IncomeStatementSchemaDTO = z.infer<typeof IncomeStatementSchema>;

export const emptyIncomeStatement: IncomeStatementSchemaDTO = {
    date: "",
    dateLocal: "",
    todate: "",
    todateLocal: "",
    branch: "",
    branchWise: "",
}

