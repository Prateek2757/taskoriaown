import type { FieldValues } from "react-hook-form";
import { z } from "zod";

export const AddTrainerSchema = z.object({
	// Personal Details
	salutation: z.string().min(1, { message: "Please select a salutation" }),
	firstName: z.string().min(1, { message: "Please enter first name" }),
	middleName: z.string().optional().nullable(),
	lastName: z.string().min(1, { message: "Please enter last name" }),
	fullNameLocal: z.string().min(1, { message: "Please enter full name in Nepali" }),
	gender: z.string().min(1, { message: "Please select gender" }),

	idType: z.string().min(1, { message: "Please select ID type" }),
	idNo: z
		.string()
		.min(1, { message: "Please enter ID number" })
		.regex(/^[0-9/]+$/, { message: "Only numbers and slash allowed" }),
	idIssuedDistrict: z.string().min(1, { message: "Please select issuing district" }),
	identificationIssuedDate: z.string().min(1, { message: "Please enter ID issued date (BS)" }),
	identificationIssuedDateAd: z.string().min(1, { message: "Please enter ID issued date (AD)" }),

	profession: z.string().min(1, { message: "Please enter profession" }),
	qualification: z.string().min(1, { message: "Please select qualification" }),

	// Address Details
	province: z.string().min(1, { message: "Please select province" }),
	district: z.string().min(1, { message: "Please select district" }),
	municipality: z.string().min(1, { message: "Please select municipality" }),
	permanentWardNo: z.string().min(1, { message: "Please enter permanent ward number" }),
	temporaryAddress: z.string().min(1, { message: "Please enter temporary address" }),

	// Contact Details
	mobileNumber: z
		.string()
		.regex(/^9/, { message: "Mobile must start with 9" })
		.length(10, { message: "Mobile number must be 10 digits" })
		.regex(/^\d+$/, { message: "Only numbers allowed" }),
	email: z
		.string()
		.email({ message: "Invalid email address" }),
	isActive: z.boolean().optional(),
	remarks: z.string().optional().nullable(),
});

export type AddTrainerDTO = z.infer<typeof AddTrainerSchema>;

//

export const AddEditTrainerSchema = AddTrainerSchema.extend({
	trainerId: z.string().optional().nullable(),
	lastUpdated: z.string().optional().nullable(),
});

export type AddEditTrainerDTO = z.infer<typeof AddEditTrainerSchema> & FieldValues;

//

export const emptyTrainer: AddTrainerDTO = {
	salutation: "",
	firstName: "",
	middleName: "",
	lastName: "",
	fullNameLocal: "",
	gender: "",
	idType: "",
	idNo: "",
	idIssuedDistrict: "",
	identificationIssuedDate: "",
	identificationIssuedDateAd: "",
	profession: "",
	qualification: "",
	province: "",
	district: "",
	municipality: "",
	permanentWardNo: "",
	temporaryAddress: "",
	mobileNumber: "",
	email: "",
	isActive: false,
	remarks: "",
};
