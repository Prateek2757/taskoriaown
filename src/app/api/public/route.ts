import { getApiUrl } from "@/helper/apiList";
import { generateAccessToken } from "@/helper/apiService";
import { decryptData, encryptData } from "@/helper/encryptionService";
import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const tokenString = await generateAccessToken();
		console.log("tokenString", tokenString);
		if (tokenString === undefined) {
			return NextResponse.json(
				encryptData(JSON.stringify({ error: "Token generation failed" })),
				{ status: 200 },
			);
		}
		const bodyRequest = await request.json();
		const body = JSON.parse(decryptData(bodyRequest.payload));
		console.log("''''''''''>>>", body, getApiUrl(body.endpoint));
		const response = await axios.post(
			getApiUrl(body.endpoint, body.params),
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
		console.log("errrr>>>", error);
		return NextResponse.json(encryptData((error as Error).message), {
			status: 500,
		});
	}
}

export async function GET(request: NextRequest) {
	try {
		const tokenString = await generateAccessToken();
		if (tokenString === undefined) {
			return NextResponse.json(
				encryptData(JSON.stringify({ error: "Token generation failed" })),
				{ status: 200 },
			);
		}
		const paramValue = request.nextUrl.searchParams.get("param");
		if (paramValue) {
			const body = JSON.parse(decryptData(paramValue));
			const url = `${getApiUrl(body.endpoint)}?id=${body.id ? body.id : ""}`;
			const response = await axios.get(url, {
				headers: {
					Authorization: `Bearer ${tokenString}`,
				},
			});
			if (response.status !== 200) {
				return NextResponse.json(encryptData(response.statusText), {
					status: response.status,
				});
			}
			const encryptedResponse = encryptData(JSON.stringify(response.data));
			return NextResponse.json(encryptedResponse, { status: 200 });
		}
		return NextResponse.json(encryptData("No endpoint found"), {
			status: 400,
		});
	} catch (error) {
		return NextResponse.json(encryptData((error as Error).message), {
			status: 500,
		});
	}
}
