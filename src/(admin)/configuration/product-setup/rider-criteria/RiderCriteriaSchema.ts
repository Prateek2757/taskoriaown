import { z } from "zod";


export const RiderCriteriaSchema = z.object({
  rowId: z.string().optional(),
  productCode: z.string().min(1, "ProductCode is required").optional().nullable(),
  rider: z.string().min(1, "Rider is required").optional().nullable(),
  minimumSumAssured: z.string().min(1, "Min Sum Assured is required").optional().nullable(),
  maximumSumAssured: z.string().min(1, "Max Sum Assured is required").optional().nullable(),
  riderMinimumTerm: z.string().min(1, "Rider Min Term is required").optional().nullable(),
  riderMaximumTerm: z.string().min(1, "Rider Max Term is required").optional().nullable(),
  riderMinimumPayTerm: z.string().min(1, "Rider Min. Paying Term is required").optional().nullable(),
  riderMaximumPayTerm: z.string().min(1, "Rider Max. Paying Term is required").optional().nullable(),
  minimumAge: z.string().min(1, "Min Age is required").optional().nullable(),
  maximumAge: z.string().min(1, "Max Age is required").optional().nullable(),
  riderFor: z.string().min(1, "Rider For is required").optional().nullable(),
  isActive: z.boolean().optional(),
});


export type RiderCriteriaDTO = z.infer<typeof RiderCriteriaSchema>;

export const emptyRiderCriteria = {
  rowId: '',
  productCode: '',
  rider: '',
  minimumSumAssured: '',
  maximumSumAssured: '',
  riderMinimumTerm: '',
  riderMaximumTerm: '',
  riderMinimumPayTerm: '',
  riderMaximumPayTerm: '',
  minimumAge: '',
  maximumAge: '',
  riderFor: '',
  isActive: false,
}