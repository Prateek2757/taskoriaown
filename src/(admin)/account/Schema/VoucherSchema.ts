import z from "zod";
export const VouterFormTableSchema = z.object({
  sn: z.string().optional(),
  Branch: z.string().optional(),
  LedgerNumber: z.string().min(1, "Select Ledger"),
  SubLedgerNumber: z.string().optional(),
  LedgerNarration: z.string().optional(),
  DrAmount: z.string().optional(),
  CrAmount: z.string().optional(),
});
export const AddVoucherSchema = z.object({
  voucherCode: z.string().min(1, "Select Voucher Type"),
  transactionDate: z.string().optional(),
  transactionDateBS: z.string().optional(),
  branchCode: z.string().optional(),
  narration: z.string().min(1, "Narration is required"),
  voucherFile: z.any().optional(),
  policyNumber: z.string().optional(),
  voucherNumber: z.string().optional(),
  tempVoucherNumber: z.string().optional(),
  VoucherEntryListJson: z.array(VouterFormTableSchema).transform((entries) =>
    JSON.stringify(entries)
  ),

});

export type VoucherSchemaDTO = z.infer<typeof AddVoucherSchema>;
export type VouterFormTableSchemaDTO = z.infer<typeof VouterFormTableSchema>;

export const initialVoucherForm: VouterFormTableSchemaDTO = {
  sn: "",
  CrAmount: "0",
  LedgerNumber: "",
  Branch:"",
  DrAmount:"0",
    LedgerNarration: "",
    SubLedgerNumber: "",
};

export const initialVoucherData: VoucherSchemaDTO = {
  voucherCode: "",
  transactionDate: "",
  transactionDateBS: "",
  branchCode: "",
  narration: "",
  voucherFile: undefined,
  policyNumber: "",
  VoucherEntryListJson: [initialVoucherForm],
};

