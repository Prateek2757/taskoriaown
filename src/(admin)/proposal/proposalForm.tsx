"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import ProposalDetail from "@/app/(admin)/proposal/components/ProposalDetail";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import type { AddEditKycWithFileDTO } from "../kyc/schemas/kycSchema";
import PremiumForm from "../premium-calculator/components/PremiumForm";
import type { RiderDTO } from "../premium-calculator/premiumSchema";
import AssumedTarget from "./components/AssumedTarget";
import Documents from "./components/Documents";
import InsuredBuildDetails from "./components/InsuredBuildDetails";
import InsuredConstultantDoctorDetails from "./components/InsuredConstultantDoctorDetails";
import InsuredDoctorDetails from "./components/InsuredDoctorDetails";
import InsuredLabTestDetails from "./components/InsuredLabTestDetails";
import InsuredMedicalDetails from "./components/InsuredMedicalDetails";
import KYCDetails from "./components/KYCDetails";
import NomineeDetail from "./components/NomineeDetails";
import OccupationDetails from "./components/OccupationDetails";
import {
	type AddProposalDTO,
	AddProposalSchema,
	emptyProposal,
} from "./proposalSchema";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export type ProposalFormProps = {
	data?: AddProposalDTO;
};

export default function ProposalForm({ data }: ProposalFormProps) {
	const { showToast } = useToast();
	const router = useRouter();

	const [validationErrors, setValidationErrors] = useState<string[]>([]);

	const [kycData, setKycData] = useState<AddEditKycWithFileDTO>();
	const [kycLoading, setKycLoading] = useState(true);
	const [productList, setProductList] = useState([]);
	const [ridersList, setRidersList] = useState<RiderDTO[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [occupationList, setOccupationList] = useState<
		ProposalRequiredFields | undefined
	>();
	const [KycNumberEncrypted, setKycNumberEncrypted] = useState("");
	const [proposalRequiredFields, setProposalRequiredFields] = useState<
		ProposalRequiredFields | undefined
	>();

	const form = useForm({
		resolver: zodResolver(AddProposalSchema),
		defaultValues: {
			...emptyProposal,
			ridersList: ridersList.map((rider) => ({
				...rider,
				isSelected: false,
				sumAssured: "",
				term: "",
				payTerm: "",
			})),
		},
		mode: "onChange",
	});

	const params = useSearchParams();

	useEffect(() => {
		if (!data) {
			setKycNumberEncrypted(params.get("kyc") as string);
		} else {
			setKycNumberEncrypted(data?.insuredDetails?.kycNumberEncrypted || "");
		}
	}, [data, params]);

	useEffect(() => {
		if (data?.kycNumber) form.reset(data);
	}, [form, data]);

	useEffect(() => {
		if (!KycNumberEncrypted) return;
		const fetchKycData = async () => {
			setKycLoading(true);
			try {
				const data = {
					KYCNumberEncrypted: KycNumberEncrypted || null,
					endpoint: "kyc_view",
				};
				const response = await apiPostCall(data as PostCallData);
				console.log("KYC Data:", response);
				if (response?.data && response.status === API_CONSTANTS.success) {
					setKycData(response.data);
				} else {
					console.error("Invalid response format or failed API call");
				}
			} catch (error) {
				console.error("Error fetching Kyc Detail data:", error);
			} finally {
				setKycLoading(false);
			}
		};
		fetchKycData();
	}, [KycNumberEncrypted]);

	useEffect(() => {
		const getProposalRequireList = async () => {
			try {
				const data = {
					endpoint: "proposal_required_list",
				};
				console.log("this is product list data", data);
				const response = await apiPostCall(data as PostCallData);
				console.log("this is product list response", response);
				if (response?.data && response.status === API_CONSTANTS.success) {
					setProposalRequiredFields(response.data);
					const activeProducts = response.data.productList?.filter(
						(item: { disabled: boolean }) => item.disabled === false,
					);
					setProductList(activeProducts);
				} else {
					console.log("Invalid response format or failed API call");
				}
			} catch (error) {
				console.log("Error fetching Kyc Detail data:", error);
			} finally {
			}
		};
		getProposalRequireList();
	}, []);

	const productCode = form.watch("productCode");
	const getOccupationList = useCallback(async (value: string) => {
		try {
			const data = {
				PRODUCTCODE: value,
				endpoint: "get_product_wise_detail",
			};
			console.log("this is getOccupationList data", data);
			const response = await apiPostCall(data as PostCallData);
			console.log("this is getOccupationList response", response);
			if (response?.data && response.status === API_CONSTANTS.success) {
				setOccupationList(response.data);
			} else {
				console.log("Invalid response format or failed API call");
			}
		} catch (error) {
			console.log("Error fetching Kyc Detail data:", error);
		} finally {
		}
	}, []);

	useEffect(() => {
		if (!productCode) return;
		getOccupationList(productCode);
	}, [productCode, getOccupationList]);

	useEffect(() => {
		if (data?.proposalNumber) {
			form.setValue("age", data?.insuredDetails.age);
		}
	}, [data?.proposalNumber, data?.insuredDetails, form]);

	useEffect(() => {
		if (kycData?.kycNumber) {
			form.setValue("kycNumber", kycData.kycNumber);
		}
	}, [kycData?.kycNumber, form]);

	const kycNumber = form.getValues("kycNumber");

	const getAllValidationErrors = (errors: any): string[] => {
		const errorMessages: string[] = [];

		const extractErrors = (obj: any, prefix = "") => {
			Object.keys(obj).forEach((key) => {
				const value = obj[key];
				const fieldPath = prefix ? `${prefix}.${key}` : key;

				if (value?.message) {
					const readableField = fieldPath
						.replace(/([A-Z])/g, " $1")
						.replace(/^./, (str) => str.toUpperCase())
						.replace(/\./g, " - ");
					errorMessages.push(`${readableField}: ${value.message}`);
				} else if (typeof value === "object" && value !== null) {
					extractErrors(value, fieldPath);
				}
			});
		};

		extractErrors(errors);
		return errorMessages;
	};

	const onSubmit: SubmitHandler<AddProposalDTO> = async (formData) => {
		try {
			setIsSubmitting(true);
			setValidationErrors([]);
			console.log("this is form data", formData);

			const submitData: PostCallData = {
				...formData,
				endpoint: "post_underwritting_form",
			};

			const response = await apiPostCall(submitData);
			console.log("this is proposal form data response", response);

			if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
				showToast(response?.data.code, response?.data.message, "Add Proposal");
				router.push("/proposal");
			} else {
				showToast(response?.data.code, response?.data.message, "Add Proposal");
			}
		} catch (error) {
			console.error("Error submitting Proposal form:", error);
			showToast(
				SYSTEM_CONSTANTS.error_code,
				`Error: ${error || "Failed to save Proposal details"}`,
				"Add Proposal",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const onInvalid = (errors: any) => {
		console.log("Form validation errors:", errors);
		const errorMessages = getAllValidationErrors(errors);
		setValidationErrors(errorMessages);

		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const sumAssured = form.watch("sumAssured");
	const age = form.watch("age");

	const [visibleMedical, setVisibleMedical] = useState(false);

	const getMedicalCriteria = useCallback(
		async (sumAssured: string, age: string) => {
			try {
				const data = {
					sumAssured: sumAssured,
					age: age,
					endpoint: "proposal_CheckMedicalReportStatus",
				};
				console.log("this is check_medical data", data);
				const response = await apiPostCall(data as PostCallData);
				console.log("this is check_medical response", response);
				if (response?.data && response.status === API_CONSTANTS.success) {
					setVisibleMedical(
						response.data.isMedicalNeed === "False" ? false : true,
					);
					console.log("medicalvisiblemedical", visibleMedical);
					form.setValue("insuredMedical.isMedicalRequired", false);
				} else {
					console.log("Invalid response format or failed API call");
				}
			} catch (error) {
				console.log("Error fetching Kyc Detail data:", error);
			} finally {
			}
		},
		[form.setValue],
	);

	useEffect(() => {
		if (!sumAssured || !age) return;
		getMedicalCriteria(sumAssured, age);
	}, [getMedicalCriteria, sumAssured, age]);

	return (
		<>
			{validationErrors.length > 0 && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
					<div className="flex">
						<div className="flex-shrink-0">
							<svg
								className="h-5 w-5 text-red-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<title>Title</title>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div className="ml-3">
							<h3 className="text-sm font-medium text-red-800">
								Please fix the following errors:
							</h3>
							<ul className="mt-2 text-sm text-red-700 list-disc list-inside">
								{validationErrors.map((error, index) => (
									<li key={`${index * 1}-errors`}>{error}</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			)}

			<KYCDetails
				kycData={kycData as AddEditKycWithFileDTO}
				KycNumberEncrypted={KycNumberEncrypted}
			/>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="flex flex-col gap-4">
					<ProposalDetail form={form} data={data} />

					<Card>
						<CardHeader>
							<CardTitle>Product Detail</CardTitle>
						</CardHeader>
						<PremiumForm
							form={form}
							productList={productList}
							setRiderList={setRidersList}
							riderList={ridersList}
							kycData={kycData as AddEditKycWithFileDTO}
							kycLoading={kycLoading}
						/>
					</Card>

					<OccupationDetails
						form={form}
						proposalRequiredFields={proposalRequiredFields}
						occupationList={occupationList}
					/>
					<AssumedTarget
						form={form}
						proposalRequiredFields={proposalRequiredFields}
					/>
					{visibleMedical && (
						<>
							<InsuredBuildDetails form={form} />
							<InsuredMedicalDetails form={form} />
							<InsuredLabTestDetails form={form} />
							<InsuredDoctorDetails form={form} />
							<InsuredConstultantDoctorDetails form={form} />
						</>
					)}
					<Documents
						form={form}
						data={data}
						fileuploadervisible={visibleMedical}
						proposalRequiredFields={proposalRequiredFields}
					/>
					<NomineeDetail
						form={form}
						data={data}
						selectdata={proposalRequiredFields}
					/>
					<Button
						type="submit"
						className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
					>
						{data?.proposalNumber ? "Update Proposal" : "Create Proposal"}
					</Button>
				</form>
			</Form>
		</>
	);
}
