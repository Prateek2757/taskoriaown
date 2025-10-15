import { z } from "zod";

export const RiderSchema = z.object({
	rider: z.string().optional(),
	minimumSumAssured: z.string().optional(),
	maximumSumAssured: z.string().optional(),
	sumAssured: z.string().nullable(),
	term: z.string().nullable(),
	minimumTerm: z.string().optional(),
	maximumTerm: z.string().optional(),
	payTerm: z.string().nullable(),
	isSelected: z.boolean().optional(),
	defaultSumAssured: z.string().optional(),
	defaultTerm: z.string().optional(),
	defaultPayTerm: z.string().optional(),
	note: z.string().optional().nullable(),

	rowId: z.string().optional().nullable(),
	riderFor: z.string().optional().nullable(),
	riderName: z.string().optional().nullable(),
	riderDescription: z.string().optional().nullable(),
	riderRate: z.string().optional().nullable(),
	extraRiderRate: z.string().optional().nullable(),
	riderPremium: z.string().optional().nullable(),
	minimumAge: z.string().optional().nullable(),
	maximumAge: z.string().optional().nullable(),
	age: z.string().optional().nullable(),
	minimumPayTerm: z.string().optional().nullable(),
	maximumPayTerm: z.string().optional().nullable(),
	occupationExtra: z.string().optional().nullable(),
	healthExtra: z.string().optional().nullable(),
	spouseOccupationExtra: z.string().optional().nullable(),
	spouseHealthExtra: z.string().optional().nullable(),
	riderMaximumAgeAtMaturity: z.string().optional().nullable(),
});

export type RiderDTO = z.infer<typeof RiderSchema>;

export const PremiumSchema = z
	.object({
		productCode: z.string().min(1, { message: "Please Select Product" }),
		age: z.string().min(1, { message: "Please Enter Date Of Birth" }),
		dateOfBirth: z.string().optional(),
		dateOfBirthLocal: z
			.string()
			.min(1, { message: "Please Enter Date Of Birth" }),
		sumAssured: z.string().min(1, { message: "Please Enter Sum Assured" }),
		modeOfPayment: z
			.string()
			.min(1, { message: "Please Select Mode of Payment" }),
		term: z.string().min(1, { message: "Please Select Term" }),
		payTerm: z.string().min(1, { message: "Please Select Pay Term" }),
		RidersJson: z.string().optional(),
		DiscountRate: z.string().optional(),
		OccupationExtraRate: z.string().optional(),
		ProposerAge: z.string().optional(),
		ProposerDateOfBirth: z.string().optional(),
		HealthExtraRate: z.string().optional(),
		IsCalculator: z.string().optional(),
		ridersList: z.array(RiderSchema).optional(),
	})
	.superRefine((data, ctx) => {
		console.log("this is rider data form", data);
		if (data.ridersList?.length) {
			console.log("rider list data", data.ridersList);
			data.ridersList.forEach((rider, index) => {
				if (rider.isSelected !== true) return;
				// =================================
				const isNumericSum = /^\d*\.?\d+$/.test(rider.sumAssured.trim());

				if (!isNumericSum) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Sum Assured must contain only numbers`,
						path: ["ridersList", index, "sumAssured"],
					});
				}
				const sumAssuredNum = parseFloat(rider.sumAssured);
				const minSumAssured = parseFloat(rider.minimumSumAssured || "0");
				let maxSumAssured = parseFloat(rider.maximumSumAssured || "999999999");

				if (parseFloat(data.sumAssured) < maxSumAssured) {
					maxSumAssured = parseFloat(data.sumAssured);
				}

				if (
					Number.isNaN(sumAssuredNum) ||
					sumAssuredNum < minSumAssured ||
					sumAssuredNum > maxSumAssured
				) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Sum Assured must be between ${minSumAssured} - ${maxSumAssured}`,
						path: ["ridersList", index, "sumAssured"],
					});
				} else if (sumAssuredNum % 1000 !== 0) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Sum Assured must be in multiples of 1000`,
						path: ["ridersList", index, "sumAssured"],
					});
				}

				// =================================

				const isNumericTerm = /^\d*\.?\d+$/.test(rider.term.trim());
				if (!isNumericTerm) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Term must contain only numbers`,
						path: ["ridersList", index, "term"],
					});
				}

				const termNum = parseFloat(rider.term);
				const minTerm = parseFloat(rider.minimumTerm || "0");
				let maxTerm = parseFloat(rider.maximumTerm || "100");

				if (parseFloat(data.term) < maxTerm) {
					maxTerm = parseFloat(data.term);
				}

				if (Number.isNaN(termNum) || termNum < minTerm || termNum > maxTerm) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Term must be less than ${rider.defaultTerm}`,
						path: ["ridersList", index, "term"],
					});
				}

				// =================================

				const isNumericPayTerm = /^\d*\.?\d+$/.test(rider.payTerm.trim());
				if (!isNumericPayTerm) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `PayTerm must contain only numbers`,
						path: ["ridersList", index, "payTerm"],
					});
				}

				const payTermNum = parseFloat(rider.payTerm);
				const minPayTerm = parseFloat(rider.minimumPayTerm || "0");
				let maxPayTerm = parseFloat(rider.maximumPayTerm || "100");
				if (parseFloat(data.payTerm) < maxPayTerm) {
					maxPayTerm = parseFloat(data.payTerm);
				}

				if (
					Number.isNaN(payTermNum) ||
					payTermNum < minPayTerm ||
					payTermNum > maxPayTerm
				) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `PayTerm must be less than ${rider.defaultPayTerm}`,
						path: ["ridersList", index, "payTerm"],
					});
				}
			});
		}
	});

export type PremiumDTO = z.infer<typeof PremiumSchema>;

export const emptyPremium: PremiumDTO = {
	productCode: "",
	age: "",
	dateOfBirth: "",
	dateOfBirthLocal: "",
	sumAssured: "",
	modeOfPayment: "",
	term: "",
	payTerm: "",
	RidersJson: "",
	DiscountRate: "",
	OccupationExtraRate: "",
	ProposerAge: "",
	ProposerDateOfBirth: "",
	HealthExtraRate: "",
	IsCalculator: "0",
};

export const emptyRiderList = (): RiderDTO => ({
	rowId: "",
	riderFor: "",
	rider: "",
	riderName: "",
	riderDescription: "",
	riderRate: "",
	extraRiderRate: "",
	riderPremium: "",
	minimumAge: "",
	maximumAge: "",
	age: "",
	minimumSumAssured: "",
	maximumSumAssured: "",
	sumAssured: "",
	minimumTerm: "",
	maximumTerm: "",
	term: "",
	minimumPayTerm: "",
	maximumPayTerm: "",
	payTerm: "",
	occupationExtra: "",
	healthExtra: "",
	spouseOccupationExtra: "",
	spouseHealthExtra: "",
	riderMaximumAgeAtMaturity: "",
	isSelected: false,
	defaultSumAssured: "",
	defaultTerm: "",
	defaultPayTerm: "",
});
