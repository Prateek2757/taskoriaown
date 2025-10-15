import type { FieldValues } from "react-hook-form";
import { z } from "zod";

export const NomineeSchema = z.object({
	name: z.string().min(1, { message: "Please Enter Nominee Name" }),
	relation: z.string().min(1, { message: "Please Select Relation" }),
	address:z.string().min(1, { message: "Please Enter Nominee Address" }),
	mobileNumber: z
		.string()
		.min(1, { message: "Please Enter Nominee Mobile Number" })
		.max(10, { message: "Mobile number cannot exceed 10 digits" })
		.refine((val) => !val || (/^9\d{9}$/.test(val) && /^\d+$/.test(val)), {
			message: "Please enter a valid 10-digit mobile number starting with 9",
		}),
});

export type NomineeDTO = z.infer<typeof NomineeSchema>;

export const AddOnlineProposalSchema = z.object({
	// ========== Personal Details ==========
	productCode:z.string().optional().nullable(),
	modeOfPayment:z.string().optional().nullable(),
	term:z.string().optional().nullable(),
	firstName: z.string().min(1, { message: "Please Enter your First Name" }),
	middleName:z.string().optional().nullable(),
	lastName: z.string().min(1, { message: "Please Enter your Last Name" }),
	mobileNumber: z
		.string()
		.regex(/^9/, { message: "Please Enter Valid Mobile Number" })
		.length(10, { message: "Please Enter 10 digit Mobile No" })
		.regex(/^\d+$/, { message: "Please Enter Numbers Only" }),
	dateOfBirth:z.string().optional().nullable(),
	dateOfBirthLocal: z
		.string()
		.min(1, { message: "Please Enter Date Of Birth" }),
	age: z
		.string()
		.min(1, { message: "Please Enter Date Of Birth" })
		.refine(
			(val) => {
				const num = Number(val);
				return !Number.isNaN(num);
			},
			{
				message: "Age must be a valid number",
			},
		)
		.refine(
			(val) => {
				const num = Number(val);
				return num >= 16 && num <= 60;
			},
			{
				message: "Age must be between 16 and 60",
			},
		),
	maritalStatus: z
		.string()
		.min(1, { message: "Please Select your Marital Status" }),
	qualification: z
		.string()
		.min(1, { message: "Please Choose your Qualification" }),
	gender: z.string().min(1, { message: "Please Select your Gender" }),
	sumAssured:z.string().optional().nullable(),
	premium:z.string().optional().nullable(),
	payTerm:z.string().optional().nullable(),

	// ========== Address Details ==========
	provinceId: z.string().min(1, { message: "Please Select your Province" }),
	districtId: z.string().min(1, { message: "Please Select your District" }),
	municipalityId: z
		.string()
		.min(1, { message: "Please Select your Municipality" }),
	wardNumber:z.string().optional().nullable(),

	//  ========== Identification Details ==========
	identityDocumentType: z
		.string()
		.min(1, { message: "Please Select your Document Type" }),
	identityDocumentIssuedDistrict: z
		.string()
		.min(1, { message: "Please Select your Identity Issued District" }),
	identityDocumentNumber: z
		.string()
		.min(1, { message: "Please Enter your Document Number" }),
	identityDocumentIssuedDate: z
		.string()
		.min(1, { message: "Please Enter Date Of Document Issue" })
		.refine(
			(dateStr) => {
				if (!dateStr) return true;
				const selected = new Date(dateStr);
				const today = new Date();
				today.setHours(0, 0, 0, 0);
				return !Number.isNaN(selected.getTime()) && selected <= today;
			},
			{
				message: "Issued date cannot be in the future",
			},
		),
	identityDocumentIssuedDateLocal: z
		.string()
		.min(1, { message: "Please Enter Date Of Document Issue" }),

	//  ========== Family Details ==========
	fatherName: z.string().min(1, { message: "Please Enter your Father Name" }),
	motherName: z.string().min(1, { message: "Please Enter your Mother Name" }),
	grandFatherName: z
		.string()
		.min(1, { message: "Please Enter your Grand Father Name" }),
	spouseName: z.string().nullable().optional(),
	sonName:z.string().optional().nullable(),
	daughterName:z.string().optional().nullable(),
	createdBy:z.string().optional().nullable(),
	createdDate:z.string().optional().nullable(),
	agentCode:z.string().optional().nullable(),

	nomineeList: z.array(NomineeSchema).optional(),

	//  ========== Document Details ==========
	insuredImageInBase64: z
		.string()
		.min(1, { message: "Please Choose Insurer Photo" }),
	insuredImageName:z.string().optional().nullable(),
	citizenshipFrontInBase64: z
		.string()
		.min(1, { message: "Please Choose Citizenship Front Photo" }),
	citizenshipFrontName:z.string().optional().nullable(),
	citizenshipBackInBase64: z
		.string()
		.min(1, { message: "Please Choose Citizenship Back Photo" }),
	citizenshipBackName:z.string().optional().nullable(),

	//  ========== Declaration ==========
	declaration: z.boolean().refine((val) => val === true, {
		message: "Declaration is required",
	}),
	agreeTerms: z.boolean().refine((val) => val === true, {
		message: "Please accept terms and conditions",
	}),
	healthDeclaration: z.boolean().refine((val) => val === true, {
		message: "Health Declaration is required",
	}),
});

export type AddOnlineProposalDTO = z.infer<typeof AddOnlineProposalSchema>;

export const AddEditOnlineProposalSchema = AddOnlineProposalSchema.extend({
	proposalNumber:z.string().optional().nullable(),
});

export type AddEditOnlineProposalDTO = z.infer<
	typeof AddEditOnlineProposalSchema
> &
	FieldValues;

export const AddEditOnlineProposalWithFileSchema =
	AddEditOnlineProposalSchema.extend({
		insuredImageUrl: z.string().nullable().optional(),
		citizenshipFrontUrl: z.string().nullable().optional(),
		citizenshipBackUrl: z.string().nullable().optional(),
	});

export type AddEditOnlineProposalWithFileDTO = z.infer<
	typeof AddEditOnlineProposalWithFileSchema
>;

export const emptyOnlineProposal = {
	gender: "",
	productCode: "13",
	modeOfPayment: "Y",
	sumAssured: "500000",
	premium: "",
	term: "5",
	payTerm: "5",
	firstName: "",
	middleName: "",
	lastName: "",
	provinceId: "",
	districtId: "",
	municipalityId: "",
	wardNumber: "",
	mobileNumber: "",
	dateOfBirth: "",
	dateOfBirthLocal: "",
	age: "",
	maritalStatus: "",
	qualification: "",
	identityDocumentType: "",
	identityDocumentIssuedDistrict: "",
	identityDocumentNumber: "",
	identityDocumentIssuedDate: "",
	identityDocumentIssuedDateLocal: "",
	fatherName: "",
	motherName: "",
	grandFatherName: "",
	spouseName: "",
	sonName: "",
	daughterName: "",
	insuredImageInBase64: "",
	insuredImageName: "",
	citizenshipFrontInBase64: "",
	citizenshipFrontName: "",
	citizenshipBackInBase64: "",
	citizenshipBackName: "",
	nomineeList: [],
	proposalNumber: "",
	insuredImageFileUrl: "",
	citizenshipFrontFileUrl: "",
	citizenshipBackFileUrl: "",
	declaration: false,
	agreeTerms: false,
	healthDeclaration: false,
};

export const createEmptyNominee = (): NomineeDTO => ({
	name: "",
	relation: "",
	address: "",
	mobileNumber: "",
});
