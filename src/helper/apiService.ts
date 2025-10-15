
import axios from "axios";
import type { RegisterDTO } from "@/app/[lang]/(auth)/authSchema";
import type { API_ENDPOINTS } from "./apiList";
import { decryptData, encryptData } from "./encryptionService";

const baseUrl = process.env.BASE_URL;
export type PostCallData = object & { endpoint: keyof typeof API_ENDPOINTS };
export type OtpFor = "REGISTRATION" | "FORGOT";
export type GenerateOtpPayload = {
	mobileNumber: string;
	otpFor: OtpFor;
	otpDescription: string;
};

export type ForgorPassordPayload = {
	mobileNumber: string;
};

export type VerifyOtpPayload = {
	mobileNumber: string;
	otpFor: OtpFor;
	otp: string;
};

export type VerifyOtpForgotPasswordPayload = {
	mobileNumber: string;
	otp: string;
};

export type ChangePasswordPayload = {
	mobileNumber: string;
	password: string;
	otp: string;
};

export const apiPostCall = async (
	data: PostCallData,
	isTokenRequired = true,
) => {
	let payload = null;
	if (data) {
		payload = { payload: encryptData(JSON.stringify(data)) };
	} else {
		return { error: "No endpoint provided", data: null, status: 400 };
	}
	//
	const responseData = await axios.post(
		isTokenRequired ? "/api/generic" : "/api/public",
		payload,
	);

	if (responseData?.data) {
		responseData.data = JSON.parse(decryptData(responseData.data));
	}
	return responseData;
};

export const apiGetCall = async (
	data: PostCallData,
	isTokenRequired = true,
) => {
	let payload = null;
	if (data) {
		payload = encryptData(JSON.stringify(data));
	} else {
		return { error: "No endpoint provided", data: null, status: 400 };
	}
	const responseData = await axios.get(
		isTokenRequired
			? `/api/generic?param=${payload}`
			: `/api/public?param=${payload}`,
	);
	if (responseData?.data) {
		responseData.data = JSON.parse(decryptData(responseData.data));
	}
	return responseData;
};

export const generateOtp = async (data: GenerateOtpPayload) => {
	try {
		let payload = null;
		if (data) {
			payload = { payload: encryptData(JSON.stringify(data)) };
		} else {
			return { error: "No endpoint provided", data: null, status: 400 };
		}
		const endpoints: Record<OtpFor, string> = {
			REGISTRATION: "/api/auth/generate-otp",
			FORGOT: "/api/auth/forgot-password",
		};
		const responseData = await axios.post(endpoints[data.otpFor], payload);
		if (responseData?.data) {
			responseData.data = JSON.parse(decryptData(responseData.data));
		}

		return responseData;
	} catch (error) {
		console.error("generateOtp error:", error);
	}
};

export const verifyOtp = async (data: VerifyOtpPayload) => {
	try {
		let payload = null;
		if (data) {
			payload = { payload: encryptData(JSON.stringify(data)) };
		} else {
			return { error: "No endpoint provided", data: null, status: 400 };
		}
		const endpoints: Record<OtpFor, string> = {
			REGISTRATION: "/api/auth/verify-otp",
			FORGOT: "/api/auth/verify-otp",
		};
		const responseData = await axios.post(endpoints[data.otpFor], payload);
		if (responseData?.data) {
			responseData.data = JSON.parse(decryptData(responseData.data));
		}

		return responseData;
	} catch (error) {
		console.error("verifyOtp error:", error);
	}
};

export const forgotPassword = async (data: ForgorPassordPayload) => {
	try {
		let payload = null;
		if (data) {
			payload = { payload: encryptData(JSON.stringify(data)) };
		} else {
			return { error: "No endpoint provided", data: null, status: 400 };
		}
		const responseData = await axios.post("/api/auth/forgot-password", payload);
		if (responseData?.data) {
			responseData.data = JSON.parse(decryptData(responseData.data));
		}

		return responseData;
	} catch (error) {
		console.error("forgotpassword error:", error);
	}
};

export const verifyOtpForgotPassword = async (
	data: VerifyOtpForgotPasswordPayload,
) => {
	try {
		let payload = null;
		if (data) {
			payload = { payload: encryptData(JSON.stringify(data)) };
		} else {
			return { error: "No endpoint provided", data: null, status: 400 };
		}
		const responseData = await axios.post(
			"/api/auth/verify-otp-forgot-password",
			payload,
		);
		if (responseData?.data) {
			responseData.data = JSON.parse(decryptData(responseData.data));
		}

		return responseData;
	} catch (error) {
		console.error("verifyOtp for forgot password:", error);
	}
};

export const generateAccessToken = async () => {
	try {
		const responseData = await axios.post(
			`${baseUrl}/api/Authentication/GenerateAccessToken`,
			{ userToken: process.env.PUBLIC_API_TOKEN },
		);
		return responseData?.data?.tokenString || null;
	} catch (error) {
		console.error("generate access token error:", error);

		return null;
	}
};

type LoginPayload = {
	mobileNumber: string;
	password: string;
	tokenString: string;
};

export const apiLoginCall = async (data: LoginPayload) => {
	try {
		const responseData = await axios.post(
			`${baseUrl}/api/OnlineUsers/Login`,
			data,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${data.tokenString}`,
				},
			},
		);
		return responseData.data;
	} catch (error) {
		console.error("apilogincall error:", error);
	}
};

type RequestOtpCallPayload = {
	tokenString: string;
};

export const requestOtpCall = async (data: RequestOtpCallPayload) => {
	try {
		const responseData = await axios.post(
			`${baseUrl}/API/Authentication/GenerateOTP`,
			data,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${data.tokenString}`,
				},
			},
		);
		return responseData.data;
	} catch (error) {
		console.error("request otp call error:", error);
	}
};

export const GenerateOnlineAccessToken = async (userToken: string) => {
	try {
		const responseData = await axios.post(
			`${baseUrl}/api/Authentication/GenerateOnlineAccessToken`,
			{ userToken },
		);
		return responseData?.data || null;
	} catch (error) {
		console.error("generate online access token error:", error);
		return null;
	}
};

export const register = async (data: RegisterDTO) => {
	try {
		let payload = null;
		if (data) {
			payload = { payload: encryptData(JSON.stringify(data)) };
		} else {
			return { error: "No endpoint provided", data: null, status: 400 };
		}
		const responseData = await axios.post("/api/auth/register", payload);
		if (responseData?.data) {
			responseData.data = JSON.parse(decryptData(responseData.data));
		}

		return responseData;
	} catch (error) {
		console.error("register error:", error);
	}
};

export const changePassword = async (data: ChangePasswordPayload) => {
	try {
		let payload = null;
		if (data) {
			payload = { payload: encryptData(JSON.stringify(data)) };
		} else {
			return { error: "No endpoint provided", data: null, status: 400 };
		}
		const responseData = await axios.post("/api/auth/change-password", payload);
		if (responseData?.data) {
			responseData.data = JSON.parse(decryptData(responseData.data));
		}

		return responseData;
	} catch (error) {
		console.error("change password error:", error);
	}
};
