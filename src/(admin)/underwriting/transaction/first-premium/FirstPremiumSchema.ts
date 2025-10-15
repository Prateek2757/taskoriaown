import z from "zod";

// Keep your existing PartialPaymentSchema
export const PartialPaymentSchema = z.object({
    // sn: z.string(),
    collectionType: z.string().optional(),
    BankName: z.string().optional(),
    ChequeNo: z.string().regex(/^[0-9\W]+$/, {
			message: "Cheque No must be a valid number",
		}).optional(),
    DepositeDateBS: z.string().optional(),
    DepositeDateAD: z.string().optional(),
    TendorAmount: z.string().optional(),
    Remarks: z.string().optional()
});

// Updated First Premium Schema
export const FirstPremiumSchema = z.object({
    // policyNumber: z.string().optional(),
    collectionType: z.string().min(1, "Collection Type is required"),
    
    // bankLedgerNumber: z.string().optional(),
    // chequeDate: z.string().optional(),
    tenderAmount: z.string().regex(/^[0-9\W]+$/, {
			message: "Tender Amount must be a valid number",
		}),

    excessAmount: z.string().optional(),
    // excessShortLedgerNumber: z.string().optional(),
    // remarks: z.string().optional(),
    // contactNumber: z.string().optional(),
    isPartialPayment: z.boolean().optional(),
    // isBackDate: z.boolean().optional(),
    // partialPaymentJson: z.string().optional(),
    proposalNumber: z.string().optional(),
    // batchId: z.string().optional(),
    // chequeNumber: z.string().optional(),
    // referenceNumber: z.string().optional(),
    payer: z.string().optional(),
    bankName: z.string().optional(),
    // bankCode: z.string().optional(),
    // bankAccountNumber: z.string().optional(),
    // bankAccountName: z.string().optional(),
    // chequeDateBS: z.string().optional(),
    // name: z.string().optional(),
    // sumAssured: z.string().optional(),
    // nominee: z.string().optional(),
    // productCode: z.string().optional(),
    // productName: z.string().optional(),
    // address: z.string().optional(),
    // term: z.string().optional(),
    // mobileNumber: z.string().optional(),
    // branchCode: z.string().optional(),
    // modeOfPayment: z.string().optional(),
    // agentCode: z.string().optional(),
    // agentName: z.string().optional(),
    medicalFee: z.string().optional(),
    // isAllowedFPIBackDate: z.string().optional(),
    // transactionDate: z.string().optional(),
    premium: z.string().optional(),
    // goamlDetails: GoamlDetailsSchema.optional(),
    // collectionTypeList: z.array(OptionSchema).optional(),
    // batchIdList: z.array(OptionSchema).optional(),
    // groupPolicyDetailsList: z.array(GroupPolicyDetailsSchema).optional(),
    // payerStatus: z.string().optional(),
    // collectionTypeList: z.array(z.string()).optional(),
    proposalNumberEncrypted: z.string().optional(),
    partialPayment: z.array(PartialPaymentSchema).optional()
});

export type FirstPremiumDTO = z.infer<typeof FirstPremiumSchema>;
export type PartialPaymentDTO = z.infer<typeof PartialPaymentSchema>;
// export type GoamlDetailsDTO = z.infer<typeof GoamlDetailsSchema>;
// export type GroupPolicyDetailsDTO = z.infer<typeof GroupPolicyDetailsSchema>;

export const emptyFirstPremium = (): FirstPremiumDTO => ({
    collectionType: "",
    tenderAmount: "",
    excessAmount: "0",
    isPartialPayment: false,
    proposalNumber: "",
    payer: "",
    bankName: "",
    medicalFee: "",
    premium: "",
    // collectionTypeList: [],
    proposalNumberEncrypted: "",
    partialPayment: []
});

export const emptyPartialPaymentSchema = (): PartialPaymentDTO => ({
    // sn: '',
    collectionType: '',
    BankName: '',
    ChequeNo: '',
    DepositeDateBS: '',
    DepositeDateAD: '',
    TendorAmount: '',
    Remarks: ''
});