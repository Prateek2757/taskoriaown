import { encryptData } from "@/helper/encryptionService";
import { NextResponse } from "next/server";
export async function POST() {
	try {
		const userToken = "35BB9FA8-E018-4721-92F2-E106CEAF9D6B";
		const response = NextResponse.json({
			message: "Login successfully",
			code: "100",
			userToken: userToken,
		});
		response.cookies.set("userToken", userToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		});
		return response;
	} catch (error) {
		return NextResponse.json(encryptData((error as Error).message), {
			status: 500,
		});
	}
}
