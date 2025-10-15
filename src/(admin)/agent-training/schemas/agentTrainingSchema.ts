import { z } from "zod";
import type { FieldValues } from "react-hook-form";

export const AddAgentTrainingSchema = z.object({
	kycNo: z.string().optional(),
	branchCode: z.string().optional(),
	name: z.string().optional(),
	nationality: z.string().optional(),

	// Exam Info
	examDateBS: z.string().optional().nullable(),
	examDateAD: z.string().optional().nullable(),
	examMarks: z.string().optional().nullable(),

	// Agent Training Info
	trainingId: z.string().min(1, { message: "Please select Training ID" }),
	superiorAgentCode: z.string().min(1, { message: "Please enter Superior Agent Code" }),
	superiorAgentRemarks: z.string().optional().nullable(),
	reportingManager: z.string().optional().nullable(),

	// PAN Info
	panNumber: z.string().optional().nullable(),

	// KYC Documents
	photoFile: z.string().min(1, { message: "Please upload Photo" }),
	photoFileName: z.string().optional().nullable(),

	citizenshipFrontFile: z.string().min(1, { message: "Please upload Citizenship Front" }),
	citizenshipFrontFileName: z.string().optional().nullable(),

	citizenshipBackFile: z.string().min(1, { message: "Please upload Citizenship Back" }),
	citizenshipBackFileName: z.string().optional().nullable(),

	// Agent Documents
	examCertificate: z.string().optional().nullable(),
	examCertificateName: z.string().optional().nullable(),

	equivalent: z.string().optional().nullable(),
	equivalentName: z.string().optional().nullable(),

	panCard: z.string().optional().nullable(),
	panCardName: z.string().optional().nullable(),

	trainingCertificate: z.string().optional().nullable(),
	trainingCertificateName: z.string().optional().nullable(),

	marksheet: z.string().optional().nullable(),
	marksheetName: z.string().optional().nullable(),

	character: z.string().optional().nullable(),
	characterName: z.string().optional().nullable(),

	uplinerDocument: z.string().optional().nullable(),
	uplinerDocumentName: z.string().optional().nullable(),

	applicationForm: z.string().optional().nullable(),
	applicationFormName: z.string().optional().nullable(),

	bankVoucher: z.string().optional().nullable(),
	bankVoucherName: z.string().optional().nullable(),

	other: z.string().optional().nullable(),
	otherName: z.string().optional().nullable(),

	// Additional Info
	remarks: z.string().optional().nullable(),
	isActive: z.boolean().optional(),
});

export type AddAgentTrainingDTO = z.infer<typeof AddAgentTrainingSchema>;

export const AddEditAgentTrainingSchema = AddAgentTrainingSchema.extend({
	agentTrainingId: z.string().optional().nullable(),
});

export type AddEditAgentTrainingDTO = z.infer<typeof AddEditAgentTrainingSchema> & FieldValues;

export const AddEditAgentTrainingWithFileSchema = AddEditAgentTrainingSchema.extend({
	photoFileUrl: z.string().optional().nullable(),
	citizenshipFrontFileUrl: z.string().optional().nullable(),
	citizenshipBackFileUrl: z.string().optional().nullable(),

	examCertificateUrl: z.string().optional().nullable(),
	equivalentUrl: z.string().optional().nullable(),
	panCardUrl: z.string().optional().nullable(),
	trainingCertificateUrl: z.string().optional().nullable(),
	marksheetUrl: z.string().optional().nullable(),
	characterUrl: z.string().optional().nullable(),
	uplinerDocumentUrl: z.string().optional().nullable(),
	applicationFormUrl: z.string().optional().nullable(),
	bankVoucherUrl: z.string().optional().nullable(),
	otherUrl: z.string().optional().nullable(),
});

export type AddEditAgentTrainingWithFileDTO = z.infer<typeof AddEditAgentTrainingWithFileSchema>;

export const emptyAgentTraining = {
	kycNo: "",
	branchCode: "",
	name: "",
	nationality: "",

	examDateBS: "",
	examDateAD: "",
	examMarks: "",

	trainingId: "",
	superiorAgentCode: "",
	superiorAgentRemarks: "",
	reportingManager: "",

	panNumber: "",

	photoFile: "",
	photoFileName: "",

	citizenshipFrontFile: "",
	citizenshipFrontFileName: "",

	citizenshipBackFile: "",
	citizenshipBackFileName: "",

	examCertificate: "",
	examCertificateName: "",

	equivalent: "",
	equivalentName: "",

	panCard: "",
	panCardName: "",

	trainingCertificate: "",
	trainingCertificateName: "",

	marksheet: "",
	marksheetName: "",

	character: "",
	characterName: "",

	uplinerDocument: "",
	uplinerDocumentName: "",

	applicationForm: "",
	applicationFormName: "",

	bankVoucher: "",
	bankVoucherName: "",

	other: "",
	otherName: "",

	remarks: "",
	isActive: false,
};

export const emptyEditAgentTraining = {
	...emptyAgentTraining,

	agentTrainingId: "",

	photoFileUrl: "",
	citizenshipFrontFileUrl: "",
	citizenshipBackFileUrl: "",

	examCertificateUrl: "",
	equivalentUrl: "",
	panCardUrl: "",
	trainingCertificateUrl: "",
	marksheetUrl: "",
	characterUrl: "",
	uplinerDocumentUrl: "",
	applicationFormUrl: "",
	bankVoucherUrl: "",
	otherUrl: "",
};
