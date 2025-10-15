import type { FieldValues } from "react-hook-form";
import { z } from "zod";

export const AddKycSchema = z.object({
	// Basic Information
	branchCode: z.string().min(1, { message: "Please Select a valid Branch" }),
	residenceStatus: z
		.string()
		.min(1, { message: "Please Select a valid Residential Status" }),
	nationality: z
		.string()
		.min(1, { message: "Please Select a valid Nationality" }),
	religion: z.string().optional().nullable(),
	salutation: z.string().min(1, { message: "Please Select Salutation" }),
	firstName: z.string().min(1, { message: "Please Enter your First Name" }),
	middleName: z.string().optional().nullable(),
	lastName: z.string().min(1, { message: "Please Enter your Last Name" }),
	nameLocal: z.string().min(1, { message: "Please Enter your Name in Nepali" }),
	age: z.string().min(1, { message: "Please Enter Date Of Birth" }),
	dateOfBirth: z.string().optional().nullable(),
	dateOfBirthLocal: z
		.string()
		.min(1, { message: "Please Enter Date Of Birth" }),
	gender: z.string().min(1, { message: "Please Select your Gender" }),
	birthPlace: z
		.string()
		.min(1, { message: "Please Enter your valid Birth Place" }),
	maritalStatus: z
		.string()
		.min(1, { message: "Please Select your Marital Status" }),

	// Contact Information
	mobileNumber: z
		.string()
		.regex(/^9/, { message: "Please Enter Valid Mobile Number" })
		.length(10, { message: "Please Enter 10 digit Mobile No" })
		.regex(/^\d+$/, { message: "Please Enter Numbers Only" }),
	email: z
		.string()
		.email({ message: "Invalid Email. Please Enter your valid Email" })
		.optional()
		.or(z.literal("")),
	landLineNumber: z.string().optional().nullable(),
	foreignPhone: z.string().optional().nullable(),
	foreignAddress: z.string().optional().nullable(),

	// Permanent Address
	permanentProvince: z
		.string()
		.min(1, { message: "Please Select your Province" }),
	permanentDistrict: z
		.string()
		.min(1, { message: "Please Select your District" }),
	permanentMunicipality: z
		.string()
		.min(1, { message: "Please Select your Municipality" }),
	permanentStreetName: z.string().optional().nullable(),
	permanentStreetNameLocal: z.string().optional().nullable(),
	permanentHouseNumber: z.string().optional().nullable(),
	permanentWardNumber: z.string().optional().nullable(),
	permanentLocation: z.string().optional().nullable(),

	// Temporary Address
	temporaryProvince: z
		.string()
		.min(1, { message: "Please Select your Province" }),
	temporaryDistrict: z
		.string()
		.min(1, { message: "Please Select your District" }),
	temporaryMunicipality: z
		.string()
		.min(1, { message: "Please Select your Municipality" }),
	temporaryStreetName: z.string().optional().nullable(),
	temporaryStreetNameLocal: z.string().optional().nullable(),
	temporaryHouseNumber: z.string().optional().nullable(),
	temporaryWardNumber: z.string().optional().nullable(),
	temporaryLocation: z.string().optional().nullable(),
	samePermanentandTemporaryAddress: z.boolean().optional(),

	// Identity Documents
	citizenShipNumber: z
		.string()
		.min(1, { message: "Please Enter your valid CitizenShip No" })
		.regex(/^[0-9\W]+$/, {
			message: "CitizenShip must not contain alphabets",
		}),
	citizenShipNumberIssuedDistrict: z
		.string()
		.min(1, { message: "Please Select your CitizenShip Issued District" }),
	citizenShipNumberIssuedDate: z.string().optional().nullable(),
	citizenShipNumberIssuedDateLocal: z.string().min(1, {
		message: "Please Choose your CitizenShip Issued Date in BS",
	}),

	// Alternative Identity Documents
	identityDocumentType: z.string().optional().nullable(),
	identityDocumentNumber: z.string().optional().nullable(),
	identityDocumentIssuedDate: z.string().optional().nullable(),
	identityDocumentIssuedDateLocal: z.string().optional().nullable(),
	identityDocumentIssuedDistrict: z.string().optional().nullable(),
	nationalIdentityNumber: z.string().optional().nullable(),

	// Professional Information
	qualification: z
		.string()
		.min(1, { message: "Please Choose your Qualification" }),
	profession: z.string().min(1, { message: "Please Choose your Profession" }),
	companyName: z.string().optional().nullable(),
	companyAddress: z.string().optional().nullable(),
	incomeAmount: z.string().optional().nullable(),
	incomeMode: z.string().optional().nullable(),
	panNumber: z.string().optional().nullable(),
	citNumber: z.string().optional().nullable(),
	pfNumber: z.string().optional().nullable(),
	ssfNumber: z.string().optional().nullable(),

	// Bank Information
	bankAccountName: z
		.string()
		.min(1, { message: "Please Enter your Bank Account Name" }),
	bankName: z.string().min(1, { message: "Please Choose your Bank" }),
	bankAccountNumber: z
		.string()
		.min(1, { message: "Please Enter your valid Bank Account No" }),
	bankBranchCode: z
		.string()
		.min(1, { message: "Please Choose your Bank Branch" }),

	// Family Information
	fatherName: z.string().min(1, { message: "Please Enter your Father Name" }),
	fatherNameLocal: z
		.string()
		.min(1, { message: "Please Enter your Father Name in Nepali" }),
	motherName: z.string().min(1, { message: "Please Enter your Mother Name" }),
	motherNameLocal: z
		.string()
		.min(1, { message: "Please Enter your Mother Name in Nepali" }),
	grandFatherName: z
		.string()
		.min(1, { message: "Please Enter your Grand Father Name" }),
	grandFatherNameLocal: z
		.string()
		.min(1, { message: "Please Enter your Grand Father Name in Nepali" }),
	spouseName: z.string().optional().nullable(),
	spouseNameLocal: z.string().optional().nullable(),

	// Landlord Information
	landLordName: z.string().optional().nullable(),
	landLordAddress: z.string().optional().nullable(),
	landLordContactNumber: z.string().optional().nullable(),

	// File Attachments
	photoFile: z.string().min(1, { message: "Please Choose Photo" }),
	photoFileName: z.string().optional().nullable(),
	citizenshipFrontFile: z
		.string()
		.min(1, { message: "Please Choose Citizenship Front" }),
	citizenshipFrontFileName: z.string().optional().nullable(),
	citizenshipBackFile: z
		.string()
		.min(1, { message: "Please Choose Citizenship Back" }),
	citizenshipBackFileName: z.string().optional().nullable(),
	passportFile: z.any().optional(),
	passportFileName: z.string().nullable().optional(),
	providentFundFile: z.any().optional(),
	providentFundFileName: z.string().nullable().optional(),
});

export type AddKycDTO = z.infer<typeof AddKycSchema>;

//

export const AddEditKycSchema = AddKycSchema.extend({
	kycNumber: z.string().optional().nullable(),
	verifiedDate: z.string().nullable(),
});

export type AddEditKycDTO = z.infer<typeof AddEditKycSchema> & FieldValues;

//

export const AddEditKycWithFileSchema = AddEditKycSchema.extend({
	photoFileUrl: z.string().nullable().optional(),
	citizenshipFrontFileUrl: z.string().nullable().optional(),
	citizenshipBackFileUrl: z.string().nullable().optional(),
	passportFileUrl: z.string().nullable().optional(),
	providentFundFileUrl: z.string().nullable().optional(),
});

export type AddEditKycWithFileDTO = z.infer<typeof AddEditKycWithFileSchema>;

export const emptyKyc = {
	age: "",
	branchCode: "",
	bankAccountName: "",
	bankAccountNumber: "",
	bankBranchCode: "",
	bankName: "",
	birthPlace: "",
	citizenShipNumber: "",
	citizenShipNumberIssuedDate: "",
	citizenShipNumberIssuedDateLocal: "",
	citizenShipNumberIssuedDistrict: "",
	citNumber: "",
	companyAddress: "",
	companyName: "",
	dateOfBirth: "",
	dateOfBirthLocal: "",
	email: "",
	fatherName: "",
	fatherNameLocal: "",
	foreignAddress: "",
	foreignPhone: "",
	gender: "",
	grandFatherName: "",
	grandFatherNameLocal: "",
	identityDocumentIssuedDate: "",
	identityDocumentIssuedDateLocal: "",
	identityDocumentIssuedDistrict: "",
	identityDocumentNumber: "",
	identityDocumentType: "",
	incomeAmount: "",
	incomeMode: "",
	landLordAddress: "",
	landLordContactNumber: "",
	landLordName: "",
	landLineNumber: "",
	lastName: "",
	maritalStatus: "",
	middleName: "",
	mobileNumber: "",
	motherName: "",
	motherNameLocal: "",
	nameLocal: "",
	nationalIdentityNumber: "",
	nationality: "",
	panNumber: "",
	permanentHouseNumber: "",
	permanentLocation: "",
	permanentProvince: "",
	permanentDistrict: "",
	permanentMunicipality: "",
	permanentStreetName: "",
	permanentStreetNameLocal: "",
	permanentWardNumber: "",
	pfNumber: "",
	profession: "",
	qualification: "",
	religion: "",
	residenceStatus: "",
	salutation: "",
	samePermanentandTemporaryAddress: false,
	spouseName: "",
	spouseNameLocal: "",
	ssfNumber: "",
	temporaryDistrict: "",
	temporaryHouseNumber: "",
	temporaryLocation: "",
	temporaryMunicipality: "",
	temporaryProvince: "",
	temporaryStreetName: "",
	temporaryStreetNameLocal: "",
	temporaryWardNumber: "",
	firstName: "",
	photoFile: "",
	photoFileName: "",
	citizenshipFrontFile: "",
	citizenshipFrontFileName: "",
	citizenshipBackFile: "",
	citizenshipBackFileName: "",
	passportFile: "",
	passportFileName: "",
	providentFundFile: "",
	providentFundFileName: "",
	verifiedDate: "",
};
