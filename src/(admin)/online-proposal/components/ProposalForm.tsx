"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	ArrowLeft,
	ArrowRight,
	Check,
	FileUser,
	IdCard,
	User,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import DocumentDetails from "@/app/(admin)/online-proposal/components/ProposalTab/DocumentDetails";
import FamilyDetails from "@/app/(admin)/online-proposal/components/ProposalTab/FamilyDetails";
import IdentificationDetails from "@/app/(admin)/online-proposal/components/ProposalTab/IdentificationDetails";
import PersonalDetails from "@/app/(admin)/online-proposal/components/ProposalTab/PersonalDetails";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import {
	type AddEditOnlineProposalDTO,
	AddEditOnlineProposalSchema,
	type AddOnlineProposalDTO,
	emptyOnlineProposal,
} from "../onlineProposalSchema";

export type ProposalFormProps = {
	data?: AddEditOnlineProposalDTO;
	dict?: any;
	isLoggedIn: boolean;
};

// Define field groups for each step

export default function ProposalForm({
	data,
	dict,
	isLoggedIn,
}: ProposalFormProps) {
	const pathname = usePathname();
	const rawLocale = pathname?.split("/")?.[1];
	const locale: "en" | "ne" =
		rawLocale === "ne" || rawLocale === "en" ? rawLocale : "en";

	const stepFieldGroups: Record<number, (keyof AddEditOnlineProposalDTO)[]> = {
		0: [
			// ========== Personal Details ==========

			"productCode",
			"modeOfPayment",
			"term",
			"firstName",
			"lastName",
			"mobileNumber",
			"dateOfBirth",
			"dateOfBirthLocal",
			"age",
			"maritalStatus",
			"qualification",
			"gender",
			// 'sumAssured',
			// 'premium',
			// 'payTerm',

			// ========== Address Details ==========
			"provinceId",
			"districtId",
			"municipalityId",
			"wardNumber",
		],
		1: [
			//  ========== Identification Details ==========
			"identityDocumentType",
			"identityDocumentIssuedDistrict",
			"identityDocumentNumber",
			"identityDocumentIssuedDate",
		],
		2: [
			//  ========== Family Details ==========
			"fatherName",
			"motherName",
			"grandFatherName",
			"spouseName",
			"sonName",
			"daughterName",
			//  ========== Nominee Details ==========
			"nomineeList",
		],
		3: [
			//  ========== Document Details ==========
			"insuredImageInBase64",
			"insuredImageName",
			"citizenshipFrontInBase64",
			"citizenshipFrontName",
			"citizenshipBackInBase64",
			"citizenshipBackName",
			// 'healthDeclaration',
		],
	};
	console.log("islogged in", isLoggedIn);
	const params = useSearchParams();
	const userName = params.get("userName") || undefined;
	const { showToast } = useToast();
	const form = useForm<AddEditOnlineProposalDTO>({
		resolver: zodResolver(AddEditOnlineProposalSchema),
		mode: "onChange",
		defaultValues: emptyOnlineProposal,
	});

	useEffect(() => {
		if (data?.proposalNumber) form.reset(data);
	}, [form, data]);

	const [currentStep, setCurrentStep] = useState(0);
	const [enabledTabs, setEnabledTabs] = useState([0]);
	const [proposalRequiredFields, setProposalRequiredFields] = useState<
		ProposalRequiredFields | undefined
	>();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [validationErrors, setValidationErrors] = useState<string[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data: PostCallData = {
					endpoint: "proposal_required_fields",
				};
				const response = await apiPostCall(data, isLoggedIn);
				if (response?.data && response.status === API_CONSTANTS.success) {
					console.log("this is required field for Proposal", response);
					setProposalRequiredFields(response.data);
				} else {
					console.error("Invalid response format or failed API call");
				}
			} catch (error) {
				console.error("Error fetching Proposal Detail data:", error);
			} finally {
			}
		};
		fetchData();
	}, [isLoggedIn]);

	const router = useRouter();

	const validateStep = async (stepIndex: number): Promise<boolean> => {
		const fieldsToValidate = stepFieldGroups[stepIndex] || [];

		setValidationErrors([]);

		try {
			const isValid = await form.trigger(fieldsToValidate);
			if (!isValid) {
				const errors = fieldsToValidate
					.map(
						(field: keyof AddEditOnlineProposalDTO) =>
							form.formState.errors[field]?.message,
					)
					.filter(Boolean);
				setValidationErrors(errors as string[]);
				return false;
			}

			return true;
		} catch (error) {
			console.error("Validation error:", error);
			return false;
		}
	};

	const tabs = [
		{
			id: 0,
			name: `${locale === "ne" ? "व्यक्तिगत विवरण" : "Personal Details"}`,
			component: (
				<PersonalDetails
					locale={locale}
					form={form}
					isLoggedIn={isLoggedIn}
					proposalRequiredFields={proposalRequiredFields}
				/>
			),
			icon: <User size={18} />,
		},
		{
			id: 1,
			name: `${locale === "ne" ? "पहिचान विवरण" : "Identification Details"}`,
			component: (
				<IdentificationDetails
					form={form}
					locale={locale}
					isLoggedIn={isLoggedIn}
					proposalRequiredFields={proposalRequiredFields}
				/>
			),
			icon: <IdCard size={18} />,
		},
		{
			id: 2,
			name: `${locale === "ne" ? "पारिवारिक विवरण" : "Family Details"}`,
			component: (
				<FamilyDetails
					locale={locale}
					proposalRequiredFields={proposalRequiredFields}
					form={form}
				/>
			),
			icon: <Users size={18} />,
		},
		{
			id: 3,
			name: `${locale === "ne" ? "कागजात विवरण" : "Document Details"}`,
			component: <DocumentDetails locale={locale} form={form} data={data} />,
			icon: <FileUser size={18} />,
		},
	];

	const handleContinue = async () => {
		const isStepValid = await validateStep(currentStep);

		if (!isStepValid) {
			window.scrollTo({ top: 0, behavior: "smooth" });
			return;
		}

		if (currentStep < tabs.length - 1) {
			const nextStep = currentStep + 1;
			setCurrentStep(nextStep);

			if (!enabledTabs.includes(nextStep)) {
				setEnabledTabs([...enabledTabs, nextStep]);
			}

			setValidationErrors([]);
			console.log("formData", form.getValues());
		} else {
			const isFormValid = await form.trigger();
			if (isFormValid) {
				form.handleSubmit(onSubmit)();
			} else {
				const allErrors = Object.values(form.formState.errors)
					.map((error) => error?.message)
					.filter(Boolean);
				setValidationErrors(allErrors as string[]);
				window.scrollTo({ top: 0, behavior: "smooth" });
			}
		}
	};

	const handleBack = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
			setValidationErrors([]);
		}
	};

	const handleTabClick = (tabIndex: number) => {
		if (enabledTabs.includes(tabIndex)) {
			setCurrentStep(tabIndex);
			setValidationErrors([]);
		}
	};

	const onSubmit: SubmitHandler<AddOnlineProposalDTO> = async (formData) => {
		console.log("formData", formData);

		try {
			setIsSubmitting(true);

			console.log("this is form data", formData);

			const submitData: PostCallData & {
				userName?: string | undefined | null;
			} = {
				...formData,
				userName,
				endpoint: "online_proposal_add",
			};
			console.log("this is proposal form data payload", submitData);

			const response = await apiPostCall(submitData, isLoggedIn);

			console.log("this is proposal form data response", response);

			if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
				showToast(
					response.data.code,
					response.data.message,
					"Proposal Added Successfully",
				);
				if (isLoggedIn) {
					router.push(
						`/online-proposal/proposalpayment/${response.data.extras}`,
					);
				} else {
					router.push("/en/proposalsuccess");
				}
			} else {
				showToast(
					response?.data.code,
					response?.data.message,
					"Proposal Addition Failed",
				);
			}
		} catch (error) {
			console.error("Error submitting Proposal form:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen">
			<div className="">
				<div className="bg-white overflow-hidden mb-2 pb-2 mt-2">
					<nav className="flex overflow-x-auto max-sm:justify-between sm:justify-start justify-center md:justify-center mt-2 sm:gap-8 gap-4 relative">
						{tabs.map((tab, index) => (
							<div
								key={tab.id}
								className="relative max-w-screen  flex items-center"
							>
								<Link
									href="#"
									onClick={(e) => {
										e.preventDefault();
										handleTabClick(tab.id);
									}}
									className={`py-2 font-medium whitespace-nowrap flex items-center ${
										currentStep === tab.id
											? "text-blue-600"
											: enabledTabs.includes(tab.id)
												? "text-green-600 cursor-pointer"
												: "text-gray-400 cursor-not-allowed"
									}`}
								>
									<span
										className={`w-10 h-10 rounded-full me-3 flex flex-shrink-0 items-center justify-center relative z-10 ${
											currentStep === tab.id
												? "bg-blue-600 text-white"
												: enabledTabs.includes(tab.id)
													? "bg-green-600 text-white"
													: "bg-gray-200 text-gray-500"
										}`}
									>
										{currentStep === tab.id ? (
											tab.icon
										) : enabledTabs.includes(tab.id) ? (
											<Check className="text-white max-sm:text-xs text-xl" />
										) : (
											tab.icon
										)}
									</span>
									<span className="max-sm:hidden">{tab.name}</span>
								</Link>
								{index < tabs.length - 1 && (
									<div className="absolute top-1/2 left-10 transform -translate-y-1/2 max-sm:flex hidden">
										<div className="w-40 @max-xs:w-20  h-0.5 bg-gray-200">
											<div
												className={`h-full w-full transition-all duration-300 ${
													enabledTabs.includes(tabs[index + 1].id)
														? "bg-green-600 w-full"
														: currentStep === tab.id
															? "bg-blue-600 w-full"
															: "bg-gray-200 w-0"
												}`}
											></div>
										</div>
									</div>
								)}
							</div>
						))}
					</nav>
				</div>

				{/* Validation Errors Display */}
				{validationErrors.length > 0 && (
					<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg
									className="h-5 w-5 text-red-400"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<title>{locale === "ne" ? "" : "Title"}</title>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<h3 className="text-sm font-medium text-red-800">
									{locale === "ne"
										? "कृपया तलका त्रुटिहरूलाई सुधार्नुहोस्:"
										: "Please correct the following errors:"}
								</h3>
								<ul className="mt-2 text-sm text-red-700 list-disc list-inside">
									{validationErrors.map((error, index) => (
										<li key={`${index}-${error}`}>{error}</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				)}

				<div className="bg-white rounded-lg border-1 mb-6 mt-4">
					<div className="p-6">
						<div className="tab-content">
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									{tabs[currentStep].component}
								</form>
							</Form>
						</div>

						<hr className="border-gray-200 my-5" />

						<div className="flex justify-between">
							{currentStep > 0 && (
								<Button
									type="button"
									disabled={isSubmitting}
									onClick={handleBack}
									className="cursor-pointer bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
								>
									<ArrowLeft size={14} className="mr-2" />
									{locale === "ne" ? "पछाडि जानुहोस्" : "Back"}
								</Button>
							)}
							<Button
								type="button"
								disabled={isSubmitting}
								onClick={handleContinue}
								className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
							>
								{isSubmitting ? (
									"Processing..."
								) : (
									<>
										{currentStep === tabs.length - 1
											? data?.proposalNumber
												? `${locale === "ne" ? "अपडेट" : "Update"}`
												: `${locale === "ne" ? "पेश गर्नुहोस्" : "Submit"}`
											: `${locale === "ne" ? "जारी" : "Continue"}`}
										{currentStep !== tabs.length - 1 && (
											<ArrowRight size={14} className="ml-2" />
										)}
									</>
								)}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
