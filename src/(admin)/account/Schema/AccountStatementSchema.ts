
import z from "zod";
export const AccountStatementSchema=z.object({
    sn: z.string().optional(),
    branch: z.string().min(1, "Select Branch"),
    ledger: z.string().min(1, "Select Ledger"),
    subledger: z.string().optional(),
})


export type AccountStatementSchemaDTO = z.infer<typeof AccountStatementSchema>;

export const emptyAccountStatement: AccountStatementSchemaDTO = {
    sn: "",
    branch: "",
    ledger: "",
}

