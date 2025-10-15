import { z } from "zod";


export const AddDistrictSchema = z.object({
    province: z.string().min(1, { message: "Please select Province" }).nullable(),
    districtName: z.string().min(1, { message: "Please enter District Name" }).nullable(),
    districtNameLocal: z.string().min(1, { message: "Please enter District Name (in Local)" }).nullable(),
    isActive: z.boolean()
});

export type AddDistrictDTO = z.infer<typeof AddDistrictSchema>;

export const emptyDistrictSchema: AddDistrictDTO = {
    province: "",
    districtName: "",
    districtNameLocal: "",
    isActive: false
};