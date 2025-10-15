import { z } from "zod";

export const NomineeSchema = z.object({
	name: z.string(),
	relation: z.string(),
	address: z.string(),
	mobileNumber: z.string(),
});

export const PolicySchema = z.object({
	policyNumber: z.string(),
	fullName: z.string(),
	term: z.string(),
	address: z.string(),
	modeOfPayment: z.string(),
	productName: z.string(),
	sumAssured: z.string(),
	premium: z.string(),
	dateOfCommencement: z.string(),
	maturityDate: z.string(),
	nomineeList: z.array(NomineeSchema),
	nextDueDate: z.string(),
	finalPayDate: z.string(),
	dateOfBirth: z.string(),
	dateOfBirthlocal: z.string(),
	identityDocumentType: z.string(),
	qrCodeImage: z.string(),
	agentCode: z.string(),
	agentName: z.string(),
	createdDate: z.string(),
});

export type PolicySchemaType = z.infer<typeof PolicySchema>;

export const PolicyReceiptSchema = z.object({
	receiptNumber: z.string(),
	agentCode: z.string(),
	policyNumber: z.string(),
	fullName: z.string(),
	sumAssured: z.string(),
	premium: z.string(),
	term: z.string(),
	productName: z.string(),
	modeOfPayment: z.string(),
	dateOfCommencement: z.string(),
	nextDueDate: z.string(),
	createdDate: z.string(),
	qrCodeImage: z.string(),
	agentLicenseNumber: z.string(),
});

export type PolicyReceiptSchemaType = z.infer<typeof PolicyReceiptSchema>;
