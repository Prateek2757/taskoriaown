import { z } from "zod";

export const agentPositionSchema = z.object({
  
  effectiveFrom: z.string().min(1, { message: "Effective From is required" }),
  effectiveTo: z.string().min(1, { message: "Effective To is required" }),
  promotedDate: z.string().min(1, { message: "Promoted Date is required" }),

  
  parentCode: z.string().min(1, { message: "Parent Code is required" }),
  positionCode: z.string().min(1, { message: "Position Code is required" }),
  positionName: z.string().min(1, { message: "Position Name is required" }),

  
  remarks: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type AgentPositionDTO = z.infer<typeof agentPositionSchema>;


export const emptyAgentPosition: AgentPositionDTO = {
  effectiveFrom: "",
  effectiveTo: "",
  promotedDate: "",
  parentCode: "",
  positionCode: "",
  positionName: "",
  remarks: "",
  isActive: true,
};
