import { z } from "zod";

export const PolicyLoanSchema = z.object({
    policyId: z.number().min(1),
    calculatedDate: z.string().optional(),
    loanDetails: z.string().optional(),
    loanFile: z.string().min(2).max(100),
    loanFileName: z.string().min(2).max(100),
    
});
 

export type PolicyLoanDTO = z.infer<typeof PolicyLoanSchema>;

export const emptyPolicyLoan: PolicyLoanDTO = {
    policyId: 0,
    calculatedDate: "",
    loanDetails: "",
};