import { z } from "zod";


export const payModeSchema = z.object({
  payMode: z.string().min(1, { message: "Please Enter Paymode" }),
  payModeType: z.string().min(1, { message: "Please Enter Paymode Type" }),
  payModeValue: z.string().min(1, { message: "Please Enter Paymode Value" }),
});

export const saTypeSchema = z.object({
  minSA: z.string().min(1, { message: "Please Enter Min SA" }),
  maxSA: z.string().min(1, { message: "Please Enter Max SA" }),
  saType: z.string().min(1, { message: "Please Enter SA Type" }),
  saValue: z.string().min(1, { message: "Please Enter SA Value" }),
});

export const productSchema = z.object({

  productId: z.string().optional().nullable(),
  productName: z.string().optional().nullable(),
  productNameLocal: z.string().optional().nullable(),
  productType: z.string().optional().nullable(),
  productGroup: z.string().optional().nullable(),
  productApprovedDate: z.string().optional().nullable(),
  productApprovedDateLocal: z.string().optional().nullable(),
  productStartDate: z.string().optional().nullable(),
  productStartDateLocal: z.string().optional().nullable(),
  productClosedDate: z.string().optional().nullable(),
  productClosedDateLocal: z.string().optional().nullable(),
  productFile: z.string().optional().nullable(),
  productFileName: z.string().optional().nullable(),

  gracePeriod: z.string().optional().nullable(),
  lapsePeriod: z.string().optional().nullable(),
  shortLateFee: z.string().optional().nullable(),
  isProposerNeeded: z.boolean().optional().nullable(),
  isSpouseNeeded: z.boolean().optional().nullable(),
  isLoanAvailable: z.boolean().optional().nullable(),
  isParticipatory: z.boolean().optional().nullable(),
  isSurvival: z.boolean().optional().nullable(),



  //product constraints


  minSumAssured: z.string().optional().nullable(),
  maxSumAssured: z.string().optional().nullable(),
  minAgeAtEntry: z.string().optional().nullable(),
  maxAgeAtEntry: z.string().optional().nullable(),
  minTerm: z.string().optional().nullable(),
  maxTerm: z.string().optional().nullable(),
  minPayingTerm: z.string().optional().nullable(),
  maxPayingTerm: z.string().optional().nullable(),
  fixedTerm: z.string().optional().nullable(),
  maxAgeAtMaturity: z.string().optional().nullable(),
  ageCalculationMethod: z.string().optional().nullable(),
  isActive: z.boolean().optional().nullable(),

  //discount and overload rate
  //Paymode
  payModeList: z.array(payModeSchema).optional(),

  //SA
  saRates: z.array(saTypeSchema).optional(),

  //description
  productDescription: z.string().optional().nullable(),

});




export type AddEditProductDTO = z.infer<typeof productSchema>;

export const emptyProduct: AddEditProductDTO = {
  productId: "",
  productName: "",
  productNameLocal: "",
  productType: "",
  productGroup: "",
  productApprovedDate: "",
  productApprovedDateLocal: "",
  productStartDate: "",
  productStartDateLocal: "",
  productClosedDate: "",
  productClosedDateLocal: "",
  productFile: "",
  productFileName: "",
  gracePeriod: "",
  lapsePeriod: "",
  shortLateFee: "",
  isProposerNeeded: false,
  isSpouseNeeded: false,
  isLoanAvailable: false,
  isParticipatory: false,
  isSurvival: false,
  minSumAssured: "",
  maxSumAssured: "",
  minAgeAtEntry: "",
  maxAgeAtEntry: "",
  minTerm: "",
  maxTerm: "",
  minPayingTerm: "",
  maxPayingTerm: "",
  fixedTerm: "",
  maxAgeAtMaturity: "",
  ageCalculationMethod: "",
  isActive: false,
  payModeList: [],
  saRates: [],
  productDescription: "",
};


export const emptyPayMode = {
  payMode: "",
  payModeType: "",
  payModeValue: "",
};

export const emptySaRate = {
  minSA: "",
  maxSA: "",
  saType: "",
  saValue: "",
};