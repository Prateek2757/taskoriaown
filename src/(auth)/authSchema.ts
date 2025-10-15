import z from "zod";

export const ChangePasswordFormSchema = z
	.object({
		mobileNumber: z.string().optional(),
		otp: z.string().optional(),
		password: z
			.string()
			.regex(
				/[^A-Za-z0-9]/,
				"Password must contain at least one special character, one uppercase letter and one number",
			)
			.regex(
				/[A-Z]/,
				"Password must contain at least one special character, one uppercase letter and one number",
			)
			.regex(
				/[0-9]/,
				"Password must contain at least one special character, one uppercase letter and one number",
			)
			.min(9, "Password must be at least 9 characters"),
		confirmPassword: z.string().min(1, "Confirm Password is required"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords do not match",
	});

export type ChangePasswordDTO = z.infer<typeof ChangePasswordFormSchema>;



export const GenerateOtpFormSchema = z.object({
	mobileNumber: z
		.string()
		.regex(/^9/, { message: "Please Enter Valid Mobile Number" })
		.length(10, { message: "Please Enter 10 digit Mobile No" })
		.regex(/^\d+$/, { message: "Please Enter Numbers Only" }),
});

export type GenerateOtpDTO = z.infer<typeof GenerateOtpFormSchema>;



export const LoginFormSchema = z.object({
	mobileNumber: z
		.string()
		.regex(/^9/, { message: "Please Enter Valid Mobile Number" })
		.length(10, { message: "Please Enter 10 digit Mobile No" })
		.regex(/^\d+$/, { message: "Please Enter Numbers Only" }),
	password: z.string().min(1, { message: "Password is required." }),
});

export type LoginDTO = z.infer<typeof LoginFormSchema>;




export const VerifyOtpFormSchema = z.object({
	mobileNumber: z.string().optional(),
	otp: z
		.string()
		.length(6, { message: "OTP must be 6 digits" })
		.regex(/^\d+$/, { message: "OTP must be numeric only" }),
});

export type VerifyOtpFormDTO = z.infer<typeof VerifyOtpFormSchema>;




export const RegisterSchema = z
	.object({
		FirstName: z.string().min(1, "First name is required"),
		MiddleName: z.string().optional(),
		LastName: z.string().min(1, "Last name is required"),
		Gender: z.enum(["Male", "Female", "Other"], {
			required_error: "Gender is required",
		}),
		MobileNumber: z.string(),
		Password: z
			.string()
			.regex(
				/[^A-Za-z0-9]/,
				"Password must contain at least one special character, one uppercase letter and one number",
			)
			.regex(
				/[A-Z]/,
				"Password must contain at least one special character, one uppercase letter and one number",
			)
			.regex(
				/[0-9]/,
				"Password must contain at least one special character, one uppercase letter and one number",
			)
			.min(9, "Password must be at least 9 characters"),
		confirmPassword: z.string().min(1, "Confirm Password is required"),
		OTP: z.string(),
	})
	.refine((data) => data.Password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords do not match",
	});
export type RegisterDTO = z.infer<typeof RegisterSchema>;






