import { z } from "zod";

export const AddMunicipalitySchema = z.object({
    province: z.string().min(1, "Province is required").optional().nullable(),
    district: z.string().min(1, "District is required").optional().nullable(),
    municipalityName: z.string().min(1, "Municipality Name is required").optional().nullable(),
    municipalityNameLocal: z.string().min(1, "Municipality Name (Local) is required").optional().nullable(),
    isActive: z.boolean(),
    rowId: z.string().optional()
})

export type AddMunicipalityDTO = z.infer<typeof AddMunicipalitySchema>;

export const AddEditMunicipalitySchema = AddMunicipalitySchema.extend({
    rowId: z.string().min(1, "Row ID is required").optional(),

});
export type AddEditMunicipalityDTO = z.infer<typeof AddEditMunicipalitySchema>;
export const emptyMunicipality: AddMunicipalityDTO = {
    province: "",
    district: "",
    municipalityName: "",
    municipalityNameLocal: "",
    isActive: false,
}
