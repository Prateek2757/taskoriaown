import { z } from "zod";

export const addSchemeSchema = z.object({
  fiscalYear: z.string().min(1, { message: "Fiscal Year is required" }),
  schemeName: z.string().min(1, { message: "Scheme Name is required" }),
  schemeFor: z.string().min(1, { message: "Scheme For is required" }),
  month: z.string().min(1, { message: "Month is required" }),
});

export type AddSchemeDTO = z.infer<typeof addSchemeSchema>;

export const emptyAddScheme: AddSchemeDTO = {
  fiscalYear: "",
  schemeName: "",
  schemeFor: "",
  month: "",
};

export const incentiveCriteriaItemSchema = z.object({
  minPremium: z.string().min(1, "Min Premium is required"),
  maxPremium: z.string().min(1, "Max Premium is required"),
  equivalentItem: z.string().optional(),
  incentive: z.string().min(1, "Incentive amount is required"),
});

export const agentIncentiveSchema = z.object({
  fiscalYear: z.string(),
  month: z.string(),
  schemeName: z.string(),
  schemeFor: z.string(),
  businessFrom: z.string().min(1, "Business From is required"),
  businessTo: z.string().min(1, "Business To is required"),
  singlePremiumPercentage: z.string().min(1, "Single Premium Percentage is required"),
  termPremiumPercentage: z.string().optional(),
  excludePremium: z.string().optional(),
  maximumPremium: z.string().min(1, "Maximum Premium is required"),
  premiumSlab: z.string().min(1, "Premium Slab is required"),
  additionalIncentive: z.string().min(1, "Additional Incentive is required"),
  document: z
    .any()
    .refine((file) => file instanceof File, "Document is required"),
  incentiveCriteria: z.array(incentiveCriteriaItemSchema).min(1, "At least one incentive criteria is required"),
  remarks: z.string().optional(),
  isActive: z.boolean(),
});

export type AgentIncentiveFormDTO = z.infer<typeof agentIncentiveSchema>;

export const emptyAgentIncentiveForm: AgentIncentiveFormDTO = {
  fiscalYear: "2081/2082",
  month: "Baishakh",
  schemeName: "12233",
  schemeFor: "AM",
  businessFrom: "",
  businessTo: "",
  singlePremiumPercentage: "",
  termPremiumPercentage: "",
  excludePremium: "",
  maximumPremium: "",
  premiumSlab: "",
  additionalIncentive: "",
  document: null,
  incentiveCriteria: [
    {
      minPremium: "",
      maxPremium: "",
      equivalentItem: "",
      incentive: "",
    },
  ],
  remarks: "",
  isActive: false,
};
