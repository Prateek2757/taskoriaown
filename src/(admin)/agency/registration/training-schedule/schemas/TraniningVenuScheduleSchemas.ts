import { z } from "zod";

export const TrainingScheduleBaseSchema = z.object({
	trainingBranch: z
		.string()
		.min(1, { message: "Please enter Training Branch" }),

	trainer: z
		.string()
		.min(1, { message: "Please select Trainer" }),

	startDate: z
		.string()
		.min(1, { message: "Please select Start Date" }),

	endDate: z
		.string()
		.min(1, { message: "Please select End Date" }),

	startTime: z
		.string()
		.min(1, { message: "Please select Start Time" }),

	endTime: z
		.string()
		.min(1, { message: "Please select End Time" }),

	venueName: z
		.string()
		.min(1, { message: "Please enter Venue Name" }),

	municipality: z
		.string()
		.min(1, { message: "Please enter Municipality" }),

	wardNo: z
		.string()
		.min(1, { message: "Please select Ward Number" }),

	province: z
		.string()
		.min(1, { message: "Please enter Province" }),

	district: z
		.string()
		.min(1, { message: "Please enter District" }),

	street: z
		.string()
		.min(1, { message: "Please enter Street" }),

	totalParticipants: z
		.string()
		.min(1, { message: "Please enter Total Participants" })
		.regex(/^\d+$/, { message: "Must be a number" }),

	remarks: z
		.string()
		.optional()
		.or(z.literal("").optional()),

	isActive: z.boolean().default(true),

	attendanceFile: z
		.string()
		.optional()
		.or(z.literal("").optional()),

	attendanceFileName: z
		.string()
		.optional()
		.or(z.literal("").optional()),
});

export const AddTrainingScheduleSchema = TrainingScheduleBaseSchema;

export const EditTrainingScheduleSchema = TrainingScheduleBaseSchema.extend({
	trainingId: z.string().optional().nullable(), // or .min(1, ...) if required
});

export type AddTrainingFormDTO = z.infer<typeof AddTrainingScheduleSchema>;
export type AddEditTrainingFormDTO = z.infer<typeof EditTrainingScheduleSchema>;

export const emptyTrainingForm: AddTrainingFormDTO = {
	trainingBranch: "",
	trainer: "",
	startDate: "",
	endDate: "",
	startTime: "",
	endTime: "",
	venueName: "",
	municipality: "",
	wardNo: "",
	province: "",
	district: "",
	street: "",
	totalParticipants: "",
	remarks: "",
	isActive: true,
	attendanceFile: "",
	attendanceFileName: "",
};
