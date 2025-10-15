import {z} from "zod";

export const riskDocumentSchema = z.object({
    riskFile: z.string().optional().nullable(),
    riskFileName: z.string().optional().nullable(),
});

export const RiskSchema = z.object({
    department:z.string().optional().nullable(),
    riskType:z.string().optional().nullable(),
    policyNo:z.string().optional().nullable(),
    policyRiskEvent:z.string().optional().nullable(),
    otherRiskEvent:z.string().optional().nullable(),
    eventDate:z.string().optional().nullable(),
    eventDateLocal:z.string().optional().nullable(),
    riskDocument:z.array(riskDocumentSchema).optional(),
    details:z.string().optional().nullable(),
    forwardRemarks:z.string().optional().nullable(),
})

export type RiskDTO = z.infer<typeof RiskSchema>;

export const emptyRisk = {
    department: "",
    riskType: "",
    policyNo: "",
    policyRiskEvent: "",
    otherRiskEvent: "",
    eventDate: "",
    eventDateLocal: "",
    riskDocument: [],
    details: "",
    forwardRemarks: "",
} 