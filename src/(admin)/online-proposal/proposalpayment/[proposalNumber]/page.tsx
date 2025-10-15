"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import ConnectIps from "@/hooks/Admin/Proposal/Connect_Ips";
import ConnectIPS from "../../../../../../public/images/connectIPS.png";
import EsewaLogo from "../../../../../../public/images/esewa.png";
import type { AddEditOnlineProposalWithFileDTO } from "../../onlineProposalSchema";

export default function Page() {
	const [proposalData, setProposalData] =
		useState<AddEditOnlineProposalWithFileDTO>();
	const [loading, setLoading] = useState(true);
	const params = useParams();
	const proposalNumber = params.proposalNumber;
	const premiumAmount = proposalData?.premium;

	const router = useRouter();
	const { handleIPSCheckout, ipsloading } = ConnectIps({
		proposalNumber: String(proposalNumber ?? ""),
		premiumAmount: premiumAmount || "",
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const data = {
					proposalNumberEncrypted: proposalNumber || null,
					endpoint: "online_proposal_view",
				};
				const response = await apiPostCall(data as PostCallData);
				console.log("this is form response", response.data.status);
				if (
					response?.data &&
					response.status === API_CONSTANTS.success &&
					response.data.status === "NEW"
				) {
					setProposalData(response.data);
				} else {
					router.push("/online-proposal");
					console.error("Invalid response format or failed API call");
				}
			} catch (error) {
				console.error("Error fetching Kyc Detail data:", error);
			} finally {
				setLoading(false);
			}
		};
		if (proposalNumber) {
			fetchData();
		}
	}, [proposalNumber, router]);

	const displayData = (
		field: keyof AddEditOnlineProposalWithFileDTO,
	): string => {
		if (!proposalData) return "Loading...";
		const value = proposalData[field];
		return value?.toString() || "N/A";
	};

	const handleCheckout = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		checkout();
	};

	const { showToast } = useToast();

	const checkout = async () => {
		try {
			setLoading(true);
			const id = `${proposalNumber}|${premiumAmount}` || null;
			const data = {
				params: { Id: id },
				endpoint: "checkout",
			};
			console.log("this is checkout data", data);

			const response = await apiPostCall(data as PostCallData);
			console.log("this is checkout response", response);
			if (
				response?.data &&
				response.data.code === SYSTEM_CONSTANTS.success_code
			) {
				showToast(
					SYSTEM_CONSTANTS.success_code,
					response.data.message,
					"Success",
				);
				generateAndSubmitEsewaForm(response.data);
			} else {
				showToast(SYSTEM_CONSTANTS.error_code, response.data.message, "Failed");
			}
		} catch (error) {
			console.error("Error fetching Payment Detail data:", error);
		} finally {
			setLoading(false);
		}
	};

	const generateAndSubmitEsewaForm = (paymentData: any) => {
		const esewaUrl = process.env.NEXT_PUBLIC_ESEWA_FORM_URL || "";
		console.log("this is Esewa URL", esewaUrl);
		console.log("this is payment data", paymentData);
		const form = document.createElement("form");
		form.action = esewaUrl;
		form.method = "POST";
		form.style.display = "none";

		const formFields = {
			amount: paymentData.amount,
			tax_amount: paymentData.tax_amount,
			total_amount: paymentData.total_amount,
			transaction_uuid: paymentData.transaction_uuid,
			product_code: paymentData.product_code,
			product_service_charge: paymentData.product_service_charge,
			product_delivery_charge: paymentData.product_delivery_charge,
			success_url: paymentData.success_url,
			failure_url: paymentData.failure_url,
			signed_field_names: paymentData.signed_field_names,
			signature: paymentData.signature,
		};

		for (const [name, value] of Object.entries(formFields)) {
			const input = document.createElement("input");
			input.type = "text";
			input.name = name;
			input.value = value || "0";
			input.required = true;
			input.className = "border-1 block w-full";
			form.appendChild(input);
		}

		document.body.appendChild(form);
		form.submit();

		setTimeout(() => {
			document.body.removeChild(form);
		}, 1000);
	};

	return (
		<div className="min-h-screen">
			<div className="">
				{loading ? (
					<div className="bg-white rounded-lg border-1 p-6 text-center">
						<p>Loading Payment details...</p>
					</div>
				) : proposalData ? (
					<div className="bg-white rounded-lg border-1 mb-6 mt-4">
						<div className="print-content">
							<div className="p-6">
								<h2 className="text-xl font-bold text-gray-800 mb-6">
									Payment Details
								</h2>

								<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
										<div className="space-y-2">
											<div className="flex items-center text-gray-700 text-sm">
												Proposal Number:
												<span className="ml-1">
													<b>{displayData("proposalNumber")}</b>
												</span>
											</div>
										</div>
										<div className="space-y-2">
											<div className="flex items-center text-gray-700 text-sm">
												Agent Code:
												<span className="ml-1">
													<b>{displayData("agentCode")}</b>
												</span>
											</div>
										</div>
										<div className="space-y-2">
											<div className="flex items-center text-gray-700 text-sm">
												Product Name:
												<span className="ml-1">
													<b>{displayData("productCode")}</b>
												</span>
											</div>
										</div>

										<div className="space-y-2">
											<div className="flex items-center text-gray-700 text-sm">
												Mode of payment:
												<span className="ml-1">
													<b>{displayData("modeOfPayment")}</b>
												</span>
											</div>
										</div>

										<div className="space-y-2">
											<div className="flex items-center text-gray-700 text-sm">
												Term:
												<span className="ml-1">
													<b>{displayData("term")}</b>
												</span>
											</div>
										</div>

										<div className="space-y-2">
											<div className="flex items-center text-gray-700 text-sm">
												Pay Term:
												<span className="ml-1">
													<b>{displayData("payTerm")}</b>
												</span>
											</div>
										</div>

										<div className="space-y-2">
											<div className="flex items-center text-gray-700 text-sm">
												First Name:
												<span className="ml-1">
													<b>{displayData("firstName")}</b>
												</span>
											</div>
										</div>

										<div className="space-y-2">
											<div className="flex items-center text-gray-700 text-sm">
												Middle name:
												<span className="ml-1">
													<b>{displayData("middleName")}</b>
												</span>
											</div>
										</div>

										<div className="space-y-2">
											<div className="flex items-center text-gray-700 text-sm">
												Last Name:
												<span className="ml-1">
													<b>{displayData("lastName")}</b>
												</span>
											</div>
										</div>
										<div className="space-y-2">
											<div className="flex items-center text-gray-700 text-sm">
												DOB in BS:
												<span className="ml-1">
													<b>{displayData("dateOfBirthLocal")}</b>
												</span>
											</div>
										</div>

										<div className="space-y-2">
											<div className="flex items-center text-gray-700 text-sm">
												DOB in AD:
												<span className="ml-1">
													<b>{displayData("dateOfBirth")}</b>
												</span>
											</div>
										</div>

										<div className="space-y-2">
											<div className="flex items-center text-gray-700 text-sm">
												Age:
												<span className="ml-1">
													<b>{displayData("age")}</b>
												</span>
											</div>
										</div>

										<div className="space-y-2">
											<div className="flex items-center text-gray-700 text-sm">
												Gender:
												<span className="ml-1">
													<b>{displayData("gender")}</b>
												</span>
											</div>
										</div>
										<div className="space-y-2">
											<div className="flex items-center text-gray-700 text-sm">
												Province:
												<span className="ml-1">
													<b>{displayData("provinceId")}</b>
												</span>
											</div>
										</div>

										<div className="space-y-2">
											<div className="flex items-center text-gray-700 text-sm">
												District:
												<span className="ml-1">
													<b>{displayData("districtId")}</b>
												</span>
											</div>
										</div>

										<div className="space-y-2">
											<div className="flex items-center text-gray-700 text-sm">
												Municipality:
												<span className="ml-1">
													<b>{displayData("municipalityId")}</b>
												</span>
											</div>
										</div>

										<div className="space-y-2">
											<div className="flex items-center text-gray-700 text-sm">
												Ward No:
												<span className="ml-1">
													<b>{displayData("wardNumber")}</b>
												</span>
											</div>
										</div>
										<div className="space-y-2">
											<div className="flex items-center text-gray-700 text-sm">
												Sum Assured:
												<span className="ml-1">
													<b>{displayData("sumAssured")}</b>
												</span>
											</div>
										</div>
										<div className="space-y-2">
											<div className="flex items-center text-gray-700 text-sm">
												Premium:
												<span className="ml-1">
													<b>{displayData("premium")}</b>
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className="bg-white rounded-lg border-1 p-6 text-center">
						<p>
							No Proposal details found for Proposal Number: {proposalNumber}
						</p>
					</div>
				)}
			</div>
			<div className="bg-white rounded-lg border-1 mb-6 mt-4">
				<div className="print-content">
					<div className="p-6">
						<h2 className="text-xl font-bold text-gray-800 mb-6">
							Payment Gateway
						</h2>

						<div className="p-6  pb-0">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
								<Button
									variant={"ghost"}
									onClick={handleCheckout}
									className="h-auto  space-y-2 border border-dashed border-blue-200 rounded-lg p-4 hover:border-blue-800 hover:bg-transparent cursor-pointer"
								>
									<Image src={EsewaLogo} alt="esewa" />
								</Button>
								{/* <Button
									variant={"ghost"}
									onClick={handleIPSCheckout}
									className="h-auto  space-y-2 border border-dashed object-cover border-blue-200 rounded-lg p-4 hover:border-blue-800 hover:bg-transparent cursor-pointer"
								>
									<Image className="w-1/3" src={ConnectIPS} alt="ConnectIPS" />
								</Button> */}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
