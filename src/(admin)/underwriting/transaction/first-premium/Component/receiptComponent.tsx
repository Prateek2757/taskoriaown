import convertToWords from "@/components/utils/convertToWords";
import Image from "next/image";
import React, { useState } from "react";

const FPReceipt = ({ fpiReceipt }: { fpiReceipt: any }) => {
	const totalDrAmount =
		fpiReceipt?.transactionDetails?.reduce(
			(sum, transactionDetail) => sum + Number(transactionDetail.drAmount || 0),
			0,
		) || 0;
	const totalCrAmount =
		fpiReceipt?.transactionDetails?.reduce(
			(sum, transactionDetail) => sum + Number(transactionDetail.drAmount || 0),
			0,
		) || 0;

	return (
		<div className="">
			{/* Header Section */}
			<div className="flex justify-between items-start mb-6">
				{/* Left - Company Details */}
				<div className=" leading-tight">
					<div className="mb-1">
						{fpiReceipt?.companyDetails.companyNameLocal}
					</div>
					<div className="mb-1">
						प.लि.न {fpiReceipt?.companyDetails.registrationNumber}
					</div>
					<div>शुल्क रसिद {fpiReceipt?.voucherNumber}</div>
				</div>

				{/* Center - Logo */}
				<div className="text-center">
					<Image
						src="/images/logo.png" // <-- Replace with actual logo path or URL
						alt="IME Life Logo"
						width={200}
						height={200}
					/>
				</div>

				{/* Right - QR Code and Number */}
				<div className="text-right">
					<div className="flex space-x-4">
						{/* Left Text */}
						<div className="">ग्राहक प्रति</div>

						{/* QR and PAN */}
						<div className="flex flex-col items-center">
							{/** biome-ignore lint/performance/noImgElement: <explanation> */}
							<img
								src={fpiReceipt?.qrCodeDetails}
								alt="QR Code"
								className="w-24 h-24"
							/>
							<div className=" mt-1">
								पान {fpiReceipt?.companyDetails.paNumber}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Title */}
			<div className="text-center mb-6">
				<h1 className="text-xl font-bold">प्रथम बीमा शुल्क रसिद</h1>
			</div>

			{/* Main Content */}
			<div className="mb-6">
				<p className="leading-relaxed">
					<span className="font-semibold">{fpiReceipt?.name}</span> बाट मिति{" "}
					<span className="font-semibold">
						{fpiReceipt?.dateOfCommencement}
					</span>{" "}
					मा निम्न तालिकामा उल्लेखित बीमा शुल्क बापत रु.{" "}
					<span className="font-semibold">{fpiReceipt?.premium}</span> (अक्षरमा{" "}
					<span className="font-semibold">
						{convertToWords(fpiReceipt?.premium)}
					</span>
					) सधन्यवाद प्राप्त भयो। ।
				</p>
			</div>

			{/* Details Table */}
			<div className="border border-gray-800 mb-6">
				<table className="w-full ">
					<thead>
						<tr className="border-b border-gray-800">
							<th className="border-r border-gray-800 p-2 text-center font-semibold">
								बीमालेख नं.
							</th>
							<th className="border-r border-gray-800 p-2 text-center font-semibold">
								बीमांक रकम रु.
							</th>
							<th className="border-r border-gray-800 p-2 text-center font-semibold">
								बीमा प्रारम्भ मिति
							</th>
							<th className="border-r border-gray-800 p-2 text-center font-semibold">
								भुक्तानी गर्नुपर्ने मिति
							</th>
							<th className="border-r border-gray-800 p-2 text-center font-semibold">
								आगामी भुक्तानी गर्नुपर्ने मिति
							</th>
							<th className="p-2 text-center font-semibold">अग्निका कोड नं.</th>
						</tr>
					</thead>
					<tbody>
						<tr className="border-b border-gray-800">
							<td className="border-r border-gray-800 p-2 text-center">
								{fpiReceipt?.policyNumber}
							</td>
							<td className="border-r border-gray-800 p-2 text-center">
								{fpiReceipt?.sumAssured}
							</td>
							<td className="border-r border-gray-800 p-2 text-center">
								{fpiReceipt?.dateOfCommencement}
							</td>
							<td className="border-r border-gray-800 p-2 text-center">
								{fpiReceipt?.dateOfCommencement}
							</td>
							<td className="border-r border-gray-800 p-2 text-center">
								{fpiReceipt?.nextDueDate}
							</td>
							<td className="p-2 text-center">{fpiReceipt?.agentCode}</td>
						</tr>
						<tr>
							<td colSpan={2} className="border-r  border-gray-800 p-2">
								<div className="flex justify-between   w-full max-w-md p-4">
									{/* Left Section */}
									<div className="space-y-1">
										<div>
											Branch: {fpiReceipt?.branchCode} /{" "}
											{fpiReceipt?.branchName}
										</div>
										<div>Pol.Term: {fpiReceipt?.term}</div>
										<div>PPT: {fpiReceipt?.payTerm}</div>
										<div>Instalment: {fpiReceipt?.instalment}</div>
									</div>

									{/* Right Section */}
									<div className="space-y-1 text-right">
										<div>MOP: {fpiReceipt?.modeOfPaymentf}</div>
										<div>Plan: {fpiReceipt?.productCode}</div>
									</div>
								</div>
							</td>
							<td colSpan={4} className=" p-2">
								<table className="min-w-full  ">
									<tbody>
										{fpiReceipt?.transactionDetails.map((transactionDetail) => (
											<tr key={transactionDetail.ledgerName}>
												<td className="px-4 py-2   text-left">
													{transactionDetail.ledgerName}
												</td>
												<td className="px-4 py-2   text-right">
													{transactionDetail.drAmount}
												</td>
												<td className="px-4 py-2   text-right">
													{transactionDetail.crAmount}
												</td>
											</tr>
										))}
										<tr>
											<td className="px-4 py-2  text-left font-medium">
												Total
											</td>
											<td className="px-4 py-2  text-right font-medium">
												{totalDrAmount}
											</td>
											<td className="px-4 py-2  text-right font-medium">
												{totalCrAmount}
											</td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* Footer Notes */}
			<div className="flex justify-between items-end text-xs">
				<div>
					<div className="mb-2">*Cheque/Drafts are subject to realization</div>
					<div>Printed By goma300 on 2025-08-05 14:12:02</div>
				</div>
				<div className="text-right">
					<div className="mb-2 mt-6">.....................................</div>
					<div>अधिकारिक दस्तखत</div>
					<div>{fpiReceipt?.companyDetails.companyNameLocal}</div>
				</div>
			</div>

			{/* Bottom Border */}
		</div>
	);
};

export default FPReceipt;
