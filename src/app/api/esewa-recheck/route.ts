import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);

	const totalAmount = searchParams.get("total_amount");
	const transactionUuid = searchParams.get("transaction_uuid");
	const esewaUrlEnv = process.env.ESEWA_URL;
	const productCodeEsewa = process.env.PRODUCT_CODE;

	const esewaUrl = `${esewaUrlEnv}/api/epay/transaction/status/?product_code=${productCodeEsewa}&total_amount=${totalAmount}&transaction_uuid=${transactionUuid}`;

	try {
		const res = await fetch(esewaUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const text = await res.text();
		return new NextResponse(text, {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		return new NextResponse(JSON.stringify({ error: "eSewa request failed" }), {
			status: 500,
		});
	}
}
