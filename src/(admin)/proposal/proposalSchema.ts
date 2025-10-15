import { z } from "zod";
import { RiderSchema } from "../premium-calculator/premiumSchema";

export const InsuredMedicalSchema = z
	.object({
		isMedicalRequired: z.boolean().optional().nullable(),
		doDrinkAlcohol: z.boolean().optional(),
		drinkUsageType: z.string().optional().nullable(),
		doSmoke: z.boolean().optional(),
		smokeUsageType: z.string().optional().nullable(),
		doUseDrugs: z.boolean().optional(),
		drugsUsageType: z.string().optional().nullable(),

		isPulseRegular: z.boolean().optional(),
		heightInCM: z.string().optional().nullable(),
		weight: z.string().optional().nullable(),
		heightFeet: z.string().optional().nullable(),
		heightInch: z.string().optional().nullable(),

		BMIstatus: z.string().optional().nullable(),
		BMI: z.string().optional().nullable(),

		chestAtExpiration: z.string().optional().nullable(),
		chestAtInspiration: z.string().optional().nullable(),
		abdominalGirth: z.string().optional().nullable(),
		systolicReading1: z.string().optional().nullable(),
		systolicReading2: z.string().optional().nullable(),
		systolicReading3: z.string().optional().nullable(),
		diastolicReading1: z.string().optional().nullable(),
		diastolicReading2: z.string().optional().nullable(),
		diastolicReading3: z.string().optional().nullable(),
		pulseRate: z.string().optional().nullable(),
		medicalFee: z.string().optional().nullable(),
		medicalTestDateLocal: z.string().optional().nullable(),
		medicalTestDate: z.string().optional().nullable(),

		sugarTestReport: z.string().optional().nullable(),
		sugarTestDateLocal: z.string().optional().nullable(),
		sugarTestDate: z.string().optional().nullable(),
		xRayTestReport: z.string().optional().nullable(),
		xRayTestDateLocal: z.string().optional().nullable(),
		xRayTestDate: z.string().optional().nullable(),
		ecgReport: z.string().optional().nullable(),
		ecgDateLocal: z.string().optional().nullable(),
		ecgDate: z.string().optional().nullable(),

		doctorName: z.string().optional().nullable(),
		doctorNMCNumber: z.string().optional().nullable(),
		doctorRemarks: z.string().optional().nullable(),

		consultantNMCNumber: z.string().optional().nullable(),
		consultantDoctorName: z.string().optional().nullable(),
		consultantRemarks: z.string().optional().nullable(),
	})
	.superRefine((data, ctx) => {
		if (data.doSmoke && !data.smokeUsageType) {
			ctx.addIssue({
				path: ["smokeUsageType"],
				code: z.ZodIssueCode.custom,
				message: "Smoking habit is required",
			});
		}

		if (data.doDrinkAlcohol && !data.drinkUsageType) {
			ctx.addIssue({
				path: ["drinkUsageType"],
				code: z.ZodIssueCode.custom,
				message: "Drinking habit is required",
			});
		}

		if (data.doUseDrugs && !data.drugsUsageType) {
			ctx.addIssue({
				path: ["drugsUsageType"],
				code: z.ZodIssueCode.custom,
				message: "Drug use habit is required",
			});
		}
		if (data.isMedicalRequired === false) return;

		const requiredNumberFields = [
			{ field: "heightInCM", name: "Height in CM" },
			{ field: "weight", name: "Weight" },
			{ field: "chestAtExpiration", name: "Chest at expiration" },
			{ field: "chestAtInspiration", name: "Chest at inspiration" },
			{ field: "abdominalGirth", name: "Abdominal girth" },
			{ field: "systolicReading1", name: "Systolic Reading 1" },
			{ field: "systolicReading2", name: "Systolic Reading 2" },
			{ field: "systolicReading3", name: "Systolic Reading 3" },
			{ field: "diastolicReading1", name: "Diastolic Reading 1" },
			{ field: "diastolicReading2", name: "Diastolic Reading 2" },
			{ field: "diastolicReading3", name: "Diastolic Reading 3" },
			{ field: "pulseRate", name: "Pulse rate" },
			{ field: "medicalFee", name: "Medical fee" },
		];

		requiredNumberFields.forEach(({ field, name }) => {
			const value = data[field as keyof typeof data] as string;
			const numValue = parseFloat(value);

			if (!value || value.trim() === "") {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `${name} is required`,
					path: [field],
				});
			} else if (!/^\d*\.?\d+$/.test(value.trim())) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Please Enter Numbers Only",
					path: [field],
				});
			}
		});

		const requiredStringFields = [
			{ field: "medicalTestDateLocal", name: "Medical test date (local)" },
			{ field: "medicalTestDate", name: "Medical test date" },
			{ field: "sugarTestReport", name: "Sugar test report" },
			{ field: "sugarTestDateLocal", name: "Sugar test date (local)" },
			{ field: "sugarTestDate", name: "Sugar test date" },
			{ field: "xRayTestReport", name: "X-Ray test report" },
			{ field: "xRayTestDateLocal", name: "X-Ray test date (local)" },
			{ field: "xRayTestDate", name: "X-Ray test date" },
			{ field: "ecgReport", name: "ECG report" },
			{ field: "ecgDateLocal", name: "ECG date (local)" },
			{ field: "ecgDate", name: "ECG date" },
			{ field: "doctorName", name: "Doctor name" },
			{ field: "doctorNMCNumber", name: "Doctor NMC number" },
			{ field: "doctorRemarks", name: "Doctor remarks" },
			{ field: "consultantNMCNumber", name: "Consultant NMC number" },
			{ field: "consultantDoctorName", name: "Consultant doctor name" },
			{ field: "consultantRemarks", name: "Consultant remarks" },
		];

		requiredStringFields.forEach(({ field, name }) => {
			const value = data[field as keyof typeof data] as string;
			if (!value || value.trim() === "") {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `${name} is required`,
					path: [field],
				});
			}
		});
	});

export type InsuredMedicalDTO = z.infer<typeof InsuredMedicalSchema>;

export const emptyInsuredMedical: InsuredMedicalDTO = {
	BMIstatus: "",
	BMI: "",
	heightFeet: "",
	heightInch: "",
	isMedicalRequired: false,
	doDrinkAlcohol: false,
	drinkUsageType: "",
	doSmoke: false,
	smokeUsageType: "",
	doUseDrugs: false,
	drugsUsageType: "",
	isPulseRegular: false,
	heightInCM: "",
	weight: "",
	chestAtExpiration: "",
	chestAtInspiration: "",
	abdominalGirth: "",
	systolicReading1: "",
	diastolicReading1: "",
	systolicReading2: "",
	systolicReading3: "",
	diastolicReading2: "",
	diastolicReading3: "",
	pulseRate: "",
	medicalFee: "",
	medicalTestDateLocal: "",
	medicalTestDate: "",
	sugarTestReport: "",
	sugarTestDateLocal: "",
	sugarTestDate: "",
	xRayTestDateLocal: "",
	xRayTestDate: "",
	ecgReport: "",
	xRayTestReport: "",
	ecgDateLocal: "",
	ecgDate: "",
	doctorName: "",
	doctorNMCNumber: "",
	doctorRemarks: "",
	consultantNMCNumber: "",
	consultantDoctorName: "",
	consultantRemarks: "",
};

export const DocumentSchema = z.object({
	documentFile: z.string().min(1, { message: "Please Enter a Document photo" }),
	documentFileName: z.string().optional().nullable(),
	documentName: z
		.string()
		.min(1, { message: "Please Enter the Document type" }),
	documentUrl: z.string().optional().nullable(),
});

export type DocumentDTO = z.infer<typeof DocumentSchema>;

export const emptyDocument: DocumentDTO = {
	documentFile: "",
	documentFileName: "",
	documentName: "",
	documentUrl: "",
};

export const NomineeSchema = z.object({
	name: z.string().min(1, { message: "Please Enter Nominee Name" }),
	nameLocal: z.string().min(1, { message: "Please Enter Nominee Name Local" }),
	address: z.string().min(1, { message: "Please Enter Nominee Address" }),
	addressLocal: z
		.string()
		.min(1, { message: "Please Enter Nominee Address Local" }),
	fatherName: z
		.string()
		.min(1, { message: "Please Enter Nominee Father Name" }),
	fatherNameLocal: z
		.string()
		.min(1, { message: "Please Enter Nominee Father Name Local" }),
	relation: z.string().min(1, { message: "Please Select Relation" }),
});

export type NomineeDTO = z.infer<typeof NomineeSchema>;

export const emptyNominee: NomineeDTO = {
	name: "",
	nameLocal: "",
	address: "",
	addressLocal: "",
	fatherName: "",
	fatherNameLocal: "",
	relation: "",
};

// =======================================================================

export const AddProposalSchema = z.object({
	branchCode: z.string().optional().nullable(),
	registerDate: z.string().optional().nullable(),

	kycNumber: z.string().optional().nullable(),
	agentCode: z.string().optional().nullable(),
	age: z.string().optional().nullable(),

	productCode: z.string().min(1, { message: "Please Select Product" }),
	sumAssured: z.string(),
	modeOfPayment: z.string().optional().nullable(),
	term: z.string().optional().nullable(),
	payTerm: z.string().optional().nullable(),

	occupationExtraId: z.string().optional().nullable(),
	occupationExtraRate: z.string().optional().nullable(),

	incomeMode: z.string().optional().nullable(),
	incomeAmount: z.string().optional().nullable(),

	isSuMAssuredWithTax: z.boolean().optional(),
	incomeSource: z.string().optional().nullable(),

	proposalNumber: z.string().optional().nullable(),
	proposalNumberEncrypted: z.string().optional().nullable(),

	clientId: z.string().optional().nullable(),

	insuredMedical: InsuredMedicalSchema,
	documentList: z.array(DocumentSchema).optional(),
	nomineeList: z.array(NomineeSchema).optional(),
	ridersList: z.array(RiderSchema).optional(),
});

export type AddProposalDTO = z.infer<typeof AddProposalSchema>;

export const emptyProposal: AddProposalDTO = {
	proposalNumber: "",
	proposalNumberEncrypted: "",
	clientId: "",

	branchCode: "300",
	registerDate: new Date().toISOString().slice(0, 10),

	kycNumber: "",
	agentCode: "",
	age: "",

	productCode: "",
	sumAssured: "",
	modeOfPayment: "",
	term: "",
	payTerm: "",

	occupationExtraId: "",
	occupationExtraRate: "",

	incomeMode: "",
	incomeAmount: "",

	isSuMAssuredWithTax: false,
	incomeSource: "",

	insuredMedical: emptyInsuredMedical,
	documentList: [],
	nomineeList: [],
	ridersList: [],
};
