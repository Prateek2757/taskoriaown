import axios from "axios";
import type { RegisterDTO } from "@/app/[lang]/(auth)/authSchema";
import { getApiUrl } from "@/helper/apiList";
import { generateAccessToken } from "@/helper/apiService";
import { decryptData, encryptData } from "@/helper/encryptionService";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const tokenString = await generateAccessToken();

		const bodyRequest = await request.json();
		const body = JSON.parse(decryptData(bodyRequest.payload)) as RegisterDTO;

		const response = await axios.post(getApiUrl("change_password"), body, {
			headers: {
				Authorization: `Bearer ${tokenString}`,
			},
		});

		const encryptedResponse = encryptData(JSON.stringify(response.data));
		return NextResponse.json(encryptedResponse, { status: 200 });
	} catch (error) {
		return NextResponse.json(encryptData((error as Error).message), {
			status: 500,
		});
	}
}
