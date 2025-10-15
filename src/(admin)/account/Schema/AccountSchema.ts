import z from "zod";

export const AccountSchema = z.object({
    ledgerNo: z.string().min(1, "Select Ledger number"),
    ledgerName: z.string().min(1, "Ledger Name is required"),
    ledgerNameLocal: z.string().optional(),
    ledgerType: z.string().optional(),
    employeeId: z.string().optional(),
    branch: z.string().optional(),
    productCode: z.string().optional(),
    bank: z.string().optional(),
    bankAccountNo: z.string().optional(),
    mobileNo: z.string().optional(),
    email: z.string().email().optional(),
    panNo: z.string().optional(),
    ledgerDescription: z.string().optional(),
    remarks: z.string().optional(),
    allowVoucherEntry: z.boolean().optional(),
    allowForBranch: z.boolean().optional(),
    // isActive: z.boolean().optional(),
    post: z.string().optional(),
    collectionType: z.string().optional(),
    BankName: z.string().optional(),
    ChequeNo: z.string().optional(),
    DepositeDateBS: z.string().optional(),
});

export type AccountSchemaDTO = z.infer<typeof AccountSchema>;

export const initialAccountData: AccountSchemaDTO = {
    ledgerNo: "",
      ledgerName: "",
      ledgerNameLocal: "",
      ledgerType: "",
      employeeId: "",
      branch: "",
      productCode: "",
      bank: "",
      bankAccountNo: "",
      mobileNo: "",
      email: "",
      panNo: "",
      ledgerDescription: "",
      remarks: "",
      allowVoucherEntry: false,
      allowForBranch: false,
    //   isActive: true,
}