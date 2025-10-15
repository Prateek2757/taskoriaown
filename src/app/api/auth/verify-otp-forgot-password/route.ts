import { getApiUrl } from "@/helper/apiList";
import { generateAccessToken, type GenerateOtpPayload } from "@/helper/apiService";
import { decryptData, encryptData } from "@/helper/encryptionService";
import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const tokenString = await generateAccessToken();

		const bodyRequest = await request.json();
		const body = JSON.parse(
			decryptData(bodyRequest.payload),
		) as GenerateOtpPayload;

		const response = await axios.post(
			getApiUrl("verify_otp_forgot_password"),
			body,
			{
				headers: {
					Authorization: `Bearer ${tokenString}`,
				},
			},
		);

		const encryptedResponse = encryptData(JSON.stringify(response.data));
		return NextResponse.json(encryptedResponse, { status: 200 });
	} catch (error) {
		return NextResponse.json(encryptData((error as Error).message), {
			status: 500,
		});
	}
}
