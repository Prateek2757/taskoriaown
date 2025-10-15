import { z } from "zod";

export const agentPositionSchema = z.object({
  // Dates
  effectiveFrom: z.string().min(1, { message: "Effective From is required" }),
  effectiveTo: z.string().min(1, { message: "Effective To is required" }),
  promotedDate: z.string().min(1, { message: "Promoted Date is required" }),

  // Position Hierarchy
  parentCode: z.string().min(1, { message: "Parent Code is required" }),
  positionCode: z.string().min(1, { message: "Position Code is required" }),
  positionName: z.string().min(1, { message: "Position Name is required" }),

  // Additional Info
  remarks: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type AgentPositionDTO = z.infer<typeof agentPositionSchema>;

// ✅ Empty defaults
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
