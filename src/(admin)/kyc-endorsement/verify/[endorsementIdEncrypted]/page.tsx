"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import type { AddEditKycWithFileDTO } from "../../schemas/endorsementSchema";
import { Badge } from "@/components/ui/badge";

export default function Page() {
	const [kycCurrentData, setKycCurrentData] = useState<AddEditKycWithFileDTO>();
	const [kycPreviousData, setKycPreviousData] =
		useState<AddEditKycWithFileDTO>();
	const [loading, setLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [filter, setFilter] = useState<"All" | "Changed" | "Same">("All");
	const [isEndorsementForwarded, setIsEndorsementForwarded] = useState(false);

	const searchparams = useSearchParams();
	const params = useParams();
	const kycNumberEncrypted = searchparams.get("KYCNumberEncrypted") as string;
	const endorsementIdEncrypted = params.endorsementIdEncrypted;
	const { showToast } = useToast();
	const router = useRouter();
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				const endorsementData = {
					endorsementIdEncrypted: endorsementIdEncrypted || null,
					endpoint: "endorsement_getverifydata",
				} as PostCallData;

				const endorsementResponse = await apiPostCall(endorsementData);
				console.log("This is Endorsement Details:", endorsementResponse);

				if (
					endorsementResponse?.data &&
					endorsementResponse.status === API_CONSTANTS.success
				) {
					setKycCurrentData(endorsementResponse.data);

					if (endorsementResponse.data.endorsementStatus === "FORWARDED") {
						setIsEndorsementForwarded(true);
					}
				} else {
					console.error(
						"Invalid response format or failed Endorsement API call",
					);
				}

				const kycData = {
					KYCNumberEncrypted: kycNumberEncrypted || null,
					endpoint: "kyc_view",
				} as PostCallData;

				const kycResponse = await apiPostCall(kycData);
				console.log("This is KYC Details:", kycResponse);

				if (kycResponse?.data && kycResponse.status === API_CONSTANTS.success) {
					setKycPreviousData(kycResponse.data);
				} else {
					console.error("Invalid response format or failed KYC API call");
				}
			} catch (error) {
				console.error("Error fetching KYC or Endorsement data:", error);
			} finally {
				setLoading(false);
			}
		};

		if (endorsementIdEncrypted && kycNumberEncrypted) {
			fetchData();
		}
	}, [endorsementIdEncrypted, kycNumberEncrypted]);

	const handleForwardEndorsement = async () => {
		try {
			setIsSubmitting(true);

			const submitData: PostCallData = {
				KYCNumberEncrypted: kycNumberEncrypted,
				endorsementIdEncrypted,
				endpoint: "forward_endorsement_detail",
			} as PostCallData;

			const respone = await apiPostCall(submitData);

			if (respone?.data.code === SYSTEM_CONSTANTS.success_code) {
				setIsEndorsementForwarded(true);
				showToast(
					respone.data.code,
					respone.data.message,
					"Forwarding Complete, Now you can Verify",
				);
			} else {
				showToast(
					respone?.data.code,
					respone?.data.message,
					"Forwarding failed! Try again",
				);
			}
		} catch (error) {
			console.error("Forwarding Error:", error);
			alert(`ERROR: ${error || "Forwarding failed"}Try again.`);
		} finally {
			setIsSubmitting(false);
		}
	};

	const verifyEndorsement = async () => {
		try {
			setIsSubmitting(true);

			const submitData: PostCallData = {
				EndorsementIdEncrypted: endorsementIdEncrypted,
				KYCNumber: kycCurrentData?.kycNumber,
				endpoint: "endorsement_verify",
			} as PostCallData;

			const respone = await apiPostCall(submitData);
			console.log("Verify.....", respone);
			if (respone?.data.code === SYSTEM_CONSTANTS.success_code) {
				showToast(
					respone.data.code,
					respone.data.message,
					"Verification Complete Endorsement Verified",
				);
				sessionStorage.removeItem("mobile-phone");
				sessionStorage.removeItem("otp");
				router.push("/kyc-endorsement");
			} else {
				showToast(
					respone?.data.code,
					respone?.data.message,
					" Verification Failed",
				);
			}
		} catch (error) {
			console.error("Verification Error:", error);
			alert(`Error: ${error || "Failed to Verify "}`);
		} finally {
			setIsSubmitting(false);
		}
	};
	if (loading) {
		return <div className="p-6 text-center">Loading KYC data...</div>;
	}

	const fileFields = [
		"photoFileUrl",
		"citizenshipFrontFileUrl",
		"citizenshipBackFileUrl",
		"passportFileUrl",
		"providentFundFileUrl",
	];

	const excludedFields = [
		"code",
		"message",
		"photoFile",
		"passportFileName",
		"citizenshipFrontFile",
		"citizenshipBackFile",
		"kycNumberEncrypted",
		"endorsementIdEncrypted",
		"photoFileName",
		"passportFile",
		"rowId",
		"createdBy",
		"createdDate",
		"verifiedDate",
		"deletionRemarks",
		"deletedBy",
		"unVerifiedRemarks",
		"unVerifieddBy",
		"verifiedBy",
		"verifiedRemarks",
		"citizenshipBackFileName",
		"citizenshipFrontFileName",
		"isActive",
		"bankStatus",
		"documentsInJSON",
		"endorsementId",
		"endorsementStatus",
		"filterCount",
		"action",
		"displayLength",
		"displayStart",
		"search",
		"flag",
		"userName",
		"sortDir",
		"sortCol",
		"status",
		"ProvidentFundFile",
	];

	const allKeys = Array.from(
		new Set([
			...Object.keys(kycPreviousData || {}),
			...Object.keys(kycCurrentData || {}),
		]),
	).filter(
		(key) => !excludedFields.includes(key),
	) as (keyof AddEditKycWithFileDTO)[];

	const filteredKeys = allKeys.filter((field) => {
		const prev = kycPreviousData?.[field] ?? "N/A";
		const curr = kycCurrentData?.[field] ?? "N/A";
		const isChanged = !(prev === curr || (prev === "N/A" && curr === "N/A"));
		if (filter === "Changed") return isChanged;
		if (filter === "Same") return !isChanged;
		return true;
	});

	const totalChanged = allKeys.reduce((acc, field) => {
		const prev = kycPreviousData?.[field] ?? "N/A";
		const curr = kycCurrentData?.[field] ?? "N/A";
		return acc + (prev !== curr ? 1 : 0);
	}, 0);

	const totalSame = allKeys.length - totalChanged;

	const formatField = (s: string) =>
		s.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());

	const endorsementStatus = kycCurrentData?.endorsementStatus ?? "";
	const isEndorsementVerified = endorsementStatus === "VERIFIED";

	return (
		<div className="min-h-screen">
			<h1 className="text-xl font-bold mb-4 mt-3">KYC Data Comparison</h1>
			<div className="flex gap-2 mb-1 items-center bg-[#F5F5F5] rounded-lg p-2 border-1">
				{["All", `Changed`, `Same`].map((buttonName) => (
					<Button
						variant={"ghost"}
						key={buttonName}
						onClick={() =>
							setFilter(
								buttonName as SetStateAction<"All" | "Changed" | "Same">,
							)
						}
						className={`border-1 border-transparent px-4 py-2 rounded-lg hover:bg-white ${
							filter === buttonName ? "border-1 border-gray-200 bg-white" : ""
						}`}
					>
						{buttonName}

						{totalChanged && buttonName === "Changed" && (
							<Badge variant="destructive">{totalChanged}</Badge>
						)}
						{/* {buttonName === "Same" && (
							<Badge variant="outline">{totalSame}</Badge>
						)} */}
					</Button>
				))}
			</div>

			<table className="w-full mb-6">
				<thead>
					<tr>
						<th className="sticky top-[62px] border p-2 w-1/3 text-md text-gray-700 bg-[#f5f5f5]">
							Field
						</th>
						<th className="sticky top-[62px] border p-2 w-1/3 text-md text-gray-700 bg-[#f5f5f5]">
							Current KYC
						</th>
						<th className="sticky top-[62px] border p-2 w-1/3 text-md text-gray-700 bg-[#f5f5f5]">
							Endorsement
						</th>
					</tr>
				</thead>
				<tbody>
					{filteredKeys.map((field) => {
						const prev = kycPreviousData?.[field] ?? "N/A";
						const curr = kycCurrentData?.[field] ?? "N/A";
						const isChanged = prev !== curr;
						const isImage = fileFields.includes(field);

						return (
							<tr
								key={field as string}
								className={
									isChanged ? "bg-red-50" : "text-gray-700 hover:bg-gray-50"
								}
							>
								<td className="border p-2 text-sm font-semibold text-gray-600">
									{formatField(field)}
								</td>
								<td className="border p-2 text-sm">
									{isImage &&
									typeof prev === "string" &&
									prev.startsWith("http") ? (
										<img
											src={prev}
											alt="Previous File"
											className="h-24 object-contain border rounded"
										/>
									) : prev && prev !== "" ? (
										String(prev)
									) : (
										"N/A"
									)}
								</td>
								<td className="border p-2 text-sm">
									{isImage &&
									typeof curr === "string" &&
									curr.startsWith("http") ? (
										<img
											src={curr}
											alt="Current File"
											className="h-24 object-contain border rounded"
										/>
									) : curr && curr !== "" ? (
										String(curr)
									) : (
										"N/A"
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			<div className=" space-x-4">
				{!isEndorsementVerified && (
					<>
						{!isEndorsementForwarded && (
							<Button
								onClick={handleForwardEndorsement}
								disabled={isSubmitting}
							>
								{isSubmitting ? "Forwarding..." : "Forward Endorsement"}
							</Button>
						)}
						{isEndorsementForwarded && (
							<Button onClick={verifyEndorsement} disabled={isSubmitting}>
								{isSubmitting ? "Verifying..." : "Verify Endorsement"}
							</Button>
						)}
					</>
				)}
			</div>
		</div>
	);
}
