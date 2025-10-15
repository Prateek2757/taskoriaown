import { z } from "zod";


export const RiderTypeSchema = z.object({
    rowId: z.string().optional(),
    rider: z.string().min(1, { message: "Rider ID is required" }),
    riderName: z.string().min(2, { message: "Rider Name is required" }),
    riderNameLocal: z.string().min(2, { message: "Rider Name (local) is required" }),
    isActive: z.boolean().optional(),
});

export type RiderTypeDTO = z.infer<typeof RiderTypeSchema>;


export const emptyRiderType: RiderTypeDTO = {
    rowId: "",
    rider: "",
    riderName: "",
    riderNameLocal: "",
    isActive: false,
};