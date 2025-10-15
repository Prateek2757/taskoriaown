import { z } from "zod";


export const SchemeWaiveSchema = z.object({
    rowId: z.string().optional(),
    schemeName: z.string().optional().nullable(),
    schemeType: z.string().optional().nullable(),
    schemePercent: z.string().optional().nullable(),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
    startDateLocal: z.string().optional().nullable(),
    endDateLocal: z.string().optional().nullable(),
    remarks: z.string().optional().nullable(),
    productCode: z.string().optional().nullable(),
    isActive: z.boolean().optional()

})

export type SchemeWaiveDTO = z.infer<typeof SchemeWaiveSchema>;

export const emptySchemeWaive = {
    rowId: '',
    schemeName: '',
    schemeType: '',
    schemePercent: '',
    startDate: '',
    endDate: '',
    startDateLocal: '',
    endDateLocal: '',
    remarks: '',
    productCode: '',
    isActive: false
}