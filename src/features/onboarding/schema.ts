import * as z from "zod";

export const isValidABN = (abn: string): boolean => {
  const cleaned = abn.replace(/\s/g, "");

  if (!/^\d{11}$/.test(cleaned)) {
    return false;
  }

  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const digits = cleaned.split("").map(Number);
  digits[0] -= 1;

  const total = digits.reduce(
    (sum, digit, index) => sum + digit * weights[index],
    0
  );

  return total % 89 === 0;
};

export type AbnLookupResult = {
  abn: string;
  entityName: string;
  businessNames: string[];
  abnStatus: string;
  abnStatusEffectiveFrom: string;
  addressState: string;
  addressPostcode: string;
  entityTypeName: string;
  gst: string;
  message: string;
  isActive: boolean;
};

const onboardingSchema = z.object({
  is_nationwide: z.boolean(),
  distance: z.string().optional(),
  city_id: z.string().optional(),
  companyName: z.string().optional(),
  abn: z
    .string()
    .optional()
    .refine((value) => !value || value.trim() === "" || isValidABN(value), {
      message: "Please enter a valid ABN",
    }),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phonenumber must be required")
    .refine(
      (val) => {
        if (!val || val === "") return true;
        const cleaned = val.replace(/\s/g, "");
        return /^(04\d{8}|0[2378]\d{8})$/.test(cleaned);
      },
      { message: "Please enter a valid Australian phone number" }
    ),
  password: z.string().min(8, "Password must be at least 8 characters"),
  hasWebsite: z.enum(["yes", "no"]).optional(),
  websiteUrl: z
    .string()
    .url("Invalid website URL")
    .optional()
    .or(z.literal("")),
  companySize: z.string().optional(),
  referralCode: z.string().optional(),
});

export const conditionalSchema = onboardingSchema
  .refine((data) => data.is_nationwide || (data.distance && data.city_id), {
    message: "Distance and City are required if you are not nationwide",
    path: ["distance"],
  })
  .refine((data) => (data.hasWebsite === "yes" ? !!data.websiteUrl : true), {
    message: "Website URL is required when you select 'Yes'",
    path: ["websiteUrl"],
  });

export type OnboardingFormData = z.infer<typeof conditionalSchema>;
export type ReferralStatus = "idle" | "validating" | "valid" | "invalid";
