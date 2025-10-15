import {z} from "zod";
export const lapsedSchema = z.object({
    remarks:z.string().min(1,"Remarks is required"),
})

export type LapsedDTO = z.infer<typeof lapsedSchema>;

export const emptyLapsed = {
    remarks: "",
};