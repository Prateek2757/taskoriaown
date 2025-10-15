// schema.ts
export type ClaimFormDTO = {
  policyNo: string;
  requestedBranch: string;
  claimType: string;
  citizenship: File | null;
  policyPaper: File | null;
  claimApplication: File | null;
  hasLoan: boolean;
  hasDocument: boolean;
  isSignatureVerified: boolean;
};
