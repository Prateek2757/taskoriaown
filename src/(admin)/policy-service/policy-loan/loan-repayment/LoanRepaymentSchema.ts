import {z} from "zod";

export const LoanRepaymentSchema = z.object({
    policyNo: z.string().optional().nullable()
})
export type LoanRepaymentDTO = z.infer<typeof LoanRepaymentSchema>;

export const emptyLoanRepayment: LoanRepaymentDTO = {
    policyNo: ''
};

export const PaymentDetailsSchema = z.object({
    dueNetLoan:z.string().optional().nullable(),
    collectionType:z.string().optional().nullable(),
    paidAmount:z.string().optional().nullable(),
    totalPaidAmount:z.string().optional().nullable(),
    isPartialPayment:z.string().optional().nullable(),
    remarks:z.string().optional().nullable(),
})

export type PaymentDetailsDTO = z.infer<typeof PaymentDetailsSchema>;

export const emptyPaymentDetails: PaymentDetailsDTO = {
    dueNetLoan:'',
    collectionType:'',
    paidAmount:'',
    totalPaidAmount:'',
    isPartialPayment:'',
    remarks:''
};