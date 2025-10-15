// import { type JSX, useState } from "react";
// import type { SubmitHandler } from "react-hook-form";
// import type { ProductProposalDTO } from "@/app/(admin)/product-proposal/productProposalSchema";
// import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
// import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";
// import { apiPostCall, type PostCallData } from "@/helper/apiService";
// import { useRouter } from "next/navigation";

// type tabsType = {
// 	id: number;
// 	component: JSX.Element;
// };
// interface HandleFormProps {
// 	tabs: tabsType[];
// 	form: any;
// }
// const useHandleFormValidation = ({ tabs, form }: HandleFormProps) => {
// 	const { showToast } = useToast();
// 	const router = useRouter();
// 	const [currentStep, setCurrentStep] = useState(16);
// 	const [enabledTabs, setEnabledTabs] = useState([0]);
// 	const [isSubmitting, setIsSubmitting] = useState(false);
// 	const [validationErrors, setValidationErrors] = useState<string[]>([]);
// 	const validateStep = async (stepIndex: number): Promise<boolean> => {
// 		const fieldsToValidate = stepFieldGroups[stepIndex] || [];

// 		setValidationErrors([]);

// 		try {
// 			const isValid = await form.trigger(fieldsToValidate);
// 			if (!isValid) {
// 				const errors = fieldsToValidate
// 					.map(
// 						(field: keyof ProductProposalDTO) =>
// 							form.formState.errors[field]?.message,
// 					)
// 					.filter(Boolean);
// 				setValidationErrors(errors as string[]);
// 				return false;
// 			}

// 			return true;
// 		} catch (error) {
// 			console.error("Validation error:", error);
// 			return false;
// 		}
// 	};
// 	const handleContinue = async () => {
// 		const isStepValid = await validateStep(currentStep);

// 		if (!isStepValid) {
// 			window.scrollTo({ top: 0, behavior: "smooth" });
// 			return;
// 		}

// 		if (currentStep < tabs.length - 1) {
// 			const nextStep = currentStep + 1;
// 			setCurrentStep(nextStep);

// 			if (!enabledTabs.includes(nextStep)) {
// 				setEnabledTabs([...enabledTabs, nextStep]);
// 			}

// 			setValidationErrors([]);
// 			// console.log('formData', form.getValues());
// 		} else {
// 			const isFormValid = await form.trigger();
// 			if (isFormValid) {
// 				form.handleSubmit(onSubmit)();
// 			} else if (isFormValid && data?.proposalNumber) {
// 				console.log("Submitting form data:", form.getValues());
// 				form.handleSubmit(onUpdate)();
// 				setCurrentStep(currentStep + 1);
// 			} else {
// 				const allErrors = Object.values(form.formState.errors)
// 					.map((error) => error?.message)
// 					.filter(Boolean);
// 				setValidationErrors(allErrors as string[]);
// 				window.scrollTo({ top: 0, behavior: "smooth" });
// 			}
// 		}
// 	};
// 	const onSubmit: SubmitHandler<ProductProposalDTO> = async (
// 		formData: ProductProposalDTO,
// 	) => {
// 		console.log("formData is being summitted underwritting", formData);

// 		try {
// 			console.log("this is Target form data", formData);

// 			const submitData: PostCallData & {
// 				userName?: string | undefined | null;
// 			} = {
// 				...formData,
// 				// riderList: (formData.riderList || [])
// 				// 	.filter((r) => r.isSelected)
// 				// 	.map((r) => ({
// 				// 		rider: r.rider,
// 				// 		age: r.age,
// 				// 		sumAssured: r.sumAssured,
// 				// 		term: r.term,
// 				// 		payTerm: r.payTerm,
// 				// 		occupationExtra: r.occupationExtra,
// 				// 		healthExtra: r.healthExtra,
// 				// 		extraRiderRate: r.extraRiderRate,
// 				// 		isSelected: r.isSelected,
// 				// 	})),
// 				endpoint: "post_underwritting_form",
// 			};
// 			console.log("this is target form data payload", submitData);

// 			const response = await apiPostCall(submitData);

// 			console.log("this is target form data response", response.data);

// 			if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
// 				showToast(
// 					response.data.code,
// 					response.data.message,
// 					"Target Added Successfully",
// 				);
// 				router.push("/proposal");
// 			} else {
// 				console.log(
// 					"this is underwritting form data response error code of the form",
// 					response.data.message,
// 				);
// 				showToast(
// 					response?.data.code,
// 					response?.data.message,
// 					"Target Addition Failed",
// 				);
// 			}
// 		} catch (error) {
// 			console.log("Error submitting underwritting form:", error);
// 		} finally {
// 			console.log("Underwritting Created");
// 		}
// 	};
// 	const onUpdate: SubmitHandler<ProductProposalDTO> = async (formData) => {
// 		console.log("formData", formData);

// 		try {
// 			setIsSubmitting(true);

// 			console.log("this is form update data", formData);
// 			return;
// 			riderL;
// 			const submitData: PostCallData = {
// 				...formData,
// 				endpoint: "post_underwritting_form",
// 			};

// 			const response = await apiPostCall(submitData);

// 			console.log("this is form data response", response);

// 			if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
// 				showToast(response?.data.code, response?.data.message, "Update KYC");
// 				// router.push('/kyc');
// 			} else {
// 				showToast(response?.data.code, response?.data.message, "Update KYC");
// 			}
// 		} catch (error) {
// 			console.error("Error submitting KYC form:", error);
// 			showToast(
// 				SYSTEM_CONSTANTS.error_code,
// 				`Error: ${error || "Failed to save KYC details"}`,
// 				"Update KYC",
// 			);
// 		} finally {
// 			setIsSubmitting(false);
// 		}
// 	};
// 	return {
// 		handleContinue,
// 		onSubmit,
// 		onUpdate,
// 		currentStep,
// 		isSubmitting,
// 		validationErrors,
// 	};
// };

// export default useHandleFormValidation;

// const stepFieldGroups: Record<number, (keyof ProductProposalDTO)[]> = {
// 	0: [
// 		// Personal Details
// 		"ProposalIdD",
// 		"ClientId",
// 		"KYCNumber",
// 		"KYCtype",
// 		"Agent",
// 		"MarkettingStaff",
// 		"GroupCode",
// 	],
// 	1: [
// 		// Personal Details
// 		"Agent",
// 		"Age",
// 		"sumAssured",
// 		"modeOfPayment",
// 		"term",
// 		"payTerm",
// 	],
// 	2: [
// 		// Product Details
// 		"productCode",
// 		"Age",
// 		"sumAssured",
// 		"modeOfPayment",
// 		"term",
// 		"payTerm",
// 	],
// 	3: [
// 		// Occupation Details
// 		"Occupation",
// 		"SAOccupationExtraRate",
// 		"OccupationDescription",
// 		"IncomeAmount",
// 		"IncomeMode",
// 		"MISC",
// 	],
// 	4: [
// 		// Assumed Details
// 		"income",
// 		"fatherName",
// 		"motherName",
// 		"motherNameLocal",
// 		"grandFatherName",
// 		"grandFatherNameLocal",
// 		"spouseName",
// 		"spouseNameLocal",
// 	],
// 	5: [
// 		// extra and discounts
// 		"landLordName",
// 		"landLordAddress",
// 		"landLordContactNumber",
// 	],
// 	6: [
// 		// Insured Build Details
// 		"insuredMedical",
// 	],
// };
