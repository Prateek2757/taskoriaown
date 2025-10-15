import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getApiUrl } from "@/helper/apiList";
import { GenerateOnlineAccessToken } from "@/helper/apiService";
import { decryptData, encryptData } from "@/helper/encryptionService";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
	try {
		const tokenResponse = await getToken(request);
		const tokenData = await tokenResponse.json();
		if (tokenData.tokenString === undefined) {
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
					Authorization: `Bearer ${tokenData.tokenString}`,
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
		const tokenResponse = await getToken(request);
		const tokenData = await tokenResponse.json();
		if (tokenData.tokenString === undefined) {
			return NextResponse.json(
				encryptData(JSON.stringify({ error: "Token generation failed" })),
				{ status: 200 },
			);
		}
		
		const paramValue = request.nextUrl.searchParams.get("param");
		
		if (paramValue) {
			try {
				const body = JSON.parse(decryptData(paramValue));
				if (!body.endpoint) {
					console.log("GET Request - No endpoint found in body");
					return NextResponse.json(encryptData(JSON.stringify({ error: "No endpoint specified" })), {
						status: 400,
					});
				}
				
				// Build URL with proper parameter handling
				let url;
				try {
					url = getApiUrl(body.endpoint);
					console.log("GET Request - Base URL from getApiUrl:", url);
					
					// Check if URL is properly constructed
					if (!url || url.includes('undefined')) {
						return NextResponse.json(encryptData(JSON.stringify({ 
							error: "API configuration error - BASE_URL not set",
							url: url
						})), {
							status: 500,
						});
					}
				} catch (urlError) {
					console.error("GET Request - Error getting API URL:", urlError);
					return NextResponse.json(encryptData(JSON.stringify({ 
						error: "Invalid endpoint", 
						endpoint: body.endpoint 
					})), {
						status: 400,
					});
				}
				
				if (body.params && body.params.id) {
					url += `?id=${body.params.id}`;
				}
				console.log("GET Request - URL with parameters:", url);
				console.log("GET Request - Final URL:", url);
				
				const response = await axios.get(url, {
					headers: {
						Authorization: `Bearer ${tokenData.tokenString}`,
					},
				});
				
				
				if (response.status !== 200) {
					return NextResponse.json(encryptData(response.statusText), {
						status: response.status,
					});
				}
				
				const encryptedResponse = encryptData(JSON.stringify(response.data));
				return NextResponse.json(encryptedResponse, { status: 200 });
				
			} catch (decryptError) {
				console.error("GET Request - Decryption error:", decryptError);
				return NextResponse.json(encryptData(JSON.stringify({ error: "Failed to decrypt parameters" })), {
					status: 400,
				});
			}
		}
		
		console.log("GET Request - No param value provided");
		return NextResponse.json(encryptData(JSON.stringify({ error: "No parameters provided" })), {
			status: 400,
		});
		
	} catch (error) {
		console.error("GET Request - General error:", error);
		return NextResponse.json(encryptData(JSON.stringify({ 
			error: "Internal server error", 
			message: (error as Error).message 
		})), {
			status: 500,
		});
	}
}

async function generateTokenString() {
	try {
		const session = await getServerSession(authOptions);
		const userToken = session?.userToken;

		if (!userToken)
			return NextResponse.json({
				message: "Unauthorized",
				status: 401,
				tokenString: undefined,
			});

		const response = await GenerateOnlineAccessToken(userToken);
		const nextResponse = NextResponse.json({
			message: "Token generated successfully",
			status: 200,
			tokenString: response.tokenString,
		});

		nextResponse.cookies.set("accessToken", response.tokenString, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		});
		nextResponse.cookies.set(
			"accessToken_expirationDate",
			response.expiryDate,
			{
				httpOnly: true,
				secure: true,
				sameSite: "strict",
			},
		);
		return nextResponse;
	} catch (error) {
		return NextResponse.json({
			message: (error as Error).message,
			status: 500,
			tokenString: undefined,
		});
	}
}

async function getToken(request: NextRequest) {
	try {
		const token = request.cookies.get("accessToken")?.value;
		const expirationDate = request.cookies.get(
			"accessToken_expirationDate",
		)?.value;
		if (token && expirationDate) {
			const currentTime = new Date().getTime();
			const expirationTime = new Date(expirationDate).getTime();
			const expirationTimeWithBuffer = expirationTime - 2000;
			if (currentTime < expirationTimeWithBuffer) {
				return NextResponse.json({
					message: "Token retrieved successfully",
					status: 200,
					tokenString: token,
				});
			}
		}
		return generateTokenString();
	} catch (error) {
		return NextResponse.json({
			message: (error as Error).message,
			status: 500,
			tokenString: undefined,
		});
	}
}
