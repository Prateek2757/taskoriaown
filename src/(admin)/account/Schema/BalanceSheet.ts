
import z from "zod";
export const BalanceSheetSchema=z.object({
    filter:z.string().optional(),
    date: z.string().optional(),
    dateLocal: z.string().min(1, "Select Branch"),
    todate: z.string().min(1, "Select Ledger"),
    todateLocal: z.string().optional(),
    branch: z.string().optional(),
    branchWise: z.string().optional(),
})


export type BalanceSheetSchemaDTO = z.infer<typeof BalanceSheetSchema>;

export const emptyBalanceSheet: BalanceSheetSchemaDTO = {
    filter:"",
    date: "",
    dateLocal: "",
    todate: "",
    todateLocal: "",
    branch: "",
    branchWise: "",
}

