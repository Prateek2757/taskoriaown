import { useCallback, useEffect, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { AddEditKycDTO } from "@/app/(admin)/kyc/schemas/kycSchema";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import { useOnlyAlphabets, useOnlyNumbers } from "@/hooks/useInputValidation";
import FormCombo from "../../../../../components/formElements/FormCombo";
import FormInput from "../../../../../components/formElements/FormInput";
import FormSelect from "../../../../../components/formElements/FormSelect";
import { useToast } from "../../../../../components/uiComponents/custom-toast/custom-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type GeneralDetailsProps = {
	kycRequiredFields?: KycRequiredFields;
	form: UseFormReturn<AddEditKycDTO>;
	setClientVerification: (value: boolean) => void;
	setMobileVerification: (value: boolean) => void;
};

const calculateAge = async (dateOfBirth: string | undefined) => {
	const submitData: PostCallData & {
		flag: string;
		search: string | undefined;
	} = {
		flag: "CalculateAge",
		search: dateOfBirth,
		endpoint: "get_utility_result",
	};

	const response = await apiPostCall(submitData);

	if (response?.status === API_CONSTANTS.success) {
		return response.data.data.toString();
	}
	throw new Error(response?.data.message || "Failed to calculate age");
};

const verifyClientId = async (params: {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	gender: string;
	fatherName: string;
	permanentDistrict: string;
	kycNumber?: string;
}) => {
	const submitData: PostCallData = {
		...params,
		endpoint: "check_client_id",
	};

	const response = await apiPostCall(submitData);

	if (response?.data.code === SYSTEM_CONSTANTS.success_code) {
		return { success: true, message: response.data.message };
	}
	throw new Error(response?.data.message || "Client verification failed");
};

const verifyMobileNumber = async (params: {
	mobileNumber: string;
	kycNumber?: string;
}) => {
	const submitData: PostCallData & {
		flag: string;
		search: string;
		extra?: string;
	} = {
		flag: "CheckMobileNo",
		search: params.mobileNumber,
		endpoint: "get_utility_result",
		...(params.kycNumber && { extra: params.kycNumber }),
	};

	const response = await apiPostCall(submitData);

	if (response?.data.code === SYSTEM_CONSTANTS.success_code) {
		return { success: true, message: response.data.message };
	}
	throw new Error(response?.data.message || "Mobile verification failed");
};

export default function GeneralDetails({
	kycRequiredFields,
	form,
	setClientVerification,
	setMobileVerification,
}: GeneralDetailsProps) {
	const DEBOUNCE_DELAY = 500;
	const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const { showToast } = useToast();
	const queryClient = useQueryClient();

	const dateOfBirth = form.watch("dateOfBirth") || undefined;
	const firstName = form.watch("firstName");
	const lastName = form.watch("lastName");
	const fatherName = form.watch("fatherName");
	const gender = form.watch("gender");
	const permanentDistrict = form.watch("permanentDistrict");
	const mobileNumber = form.watch("mobileNumber");
	const kycNumber = form.getValues("kycNumber");

	const { data: calculatedAge, error: ageError } = useQuery({
		queryKey: ["calculateAge", dateOfBirth],
		queryFn: () => calculateAge(dateOfBirth),
		enabled: !!dateOfBirth && dateOfBirth.length > 0,
		staleTime: Infinity,
		gcTime: 10 * 60 * 1000,
		retry: 1,
	});

	useEffect(() => {
		if (calculatedAge) {
			form.setValue("age", calculatedAge);
		}
	}, [calculatedAge, form]);

	useEffect(() => {
		if (ageError) {
			showToast(
				SYSTEM_CONSTANTS.error_code,
				`Failed to calculate age: ${ageError.message}`,
				"Age Calculation",
			);
		}
	}, [ageError, showToast]);

	const clientVerificationMutation = useMutation({
		mutationFn: verifyClientId,
		onSuccess: (data) => {
			showToast(
				SYSTEM_CONSTANTS.success_code,
				data.message,
				"User Verification Response Success",
			);
			setClientVerification(true);

			queryClient.setQueryData(
				[
					"clientVerification",
					firstName,
					lastName,
					dateOfBirth,
					gender,
					fatherName,
					permanentDistrict,
				],
				{ verified: true, timestamp: Date.now() },
			);
		},
		onError: (error: Error) => {
			showToast(
				SYSTEM_CONSTANTS.error_code,
				error.message,
				"User Verification Response Fail",
			);
			setClientVerification(false);
		},
	});

	const mobileVerificationMutation = useMutation({
		mutationFn: verifyMobileNumber,
		onSuccess: (data) => {
			showToast(
				SYSTEM_CONSTANTS.success_code,
				data.message,
				"Mobile Number Verification Response Success",
			);
			setMobileVerification(true);

			queryClient.setQueryData(["mobileVerification", mobileNumber], {
				verified: true,
				timestamp: Date.now(),
			});
		},
		onError: (error: Error) => {
			showToast(
				SYSTEM_CONSTANTS.error_code,
				error.message,
				"Mobile Number Verification Response Fail",
			);
			setMobileVerification(false);
		},
	});

	const performClientVerification = useCallback(() => {
		if (kycNumber !== undefined) {
			setClientVerification(true);
			return;
		}

		if (
			!firstName ||
			!lastName ||
			!dateOfBirth ||
			!gender ||
			!fatherName ||
			!permanentDistrict
		) {
			return;
		}

		const cachedResult = queryClient.getQueryData([
			"clientVerification",
			firstName,
			lastName,
			dateOfBirth,
			gender,
			fatherName,
			permanentDistrict,
		]);

		if (cachedResult && (cachedResult as any).verified) {
			setClientVerification(true);
			return;
		}

		if (debounceTimeoutRef.current) {
			clearTimeout(debounceTimeoutRef.current);
		}

		debounceTimeoutRef.current = setTimeout(() => {
			clientVerificationMutation.mutate({
				firstName,
				lastName,
				dateOfBirth,
				gender,
				fatherName,
				permanentDistrict,
				...(typeof kycNumber !== "undefined" ? { kycNumber } : {}),
			});
		}, DEBOUNCE_DELAY);
	}, [
		firstName,
		lastName,
		dateOfBirth,
		gender,
		fatherName,
		permanentDistrict,
		kycNumber,
		clientVerificationMutation,
		setClientVerification,
		queryClient,
	]);

	useEffect(() => {
		performClientVerification();
		return () => {
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}
		};
	}, [performClientVerification]);

	const performMobileVerification = useCallback(() => {
		if (kycNumber !== undefined) {
			setMobileVerification(true);
			return;
		}

		const isValidMobile = (number: string) => /^[9][0-9]{9}$/.test(number);

		if (!mobileNumber || !isValidMobile(mobileNumber)) {
			return;
		}

		const cachedResult = queryClient.getQueryData([
			"mobileVerification",
			mobileNumber,
		]);

		if (cachedResult && (cachedResult as any).verified) {
			setMobileVerification(true);
			return;
		}

		if (debounceTimeoutRef.current) {
			clearTimeout(debounceTimeoutRef.current);
		}

		debounceTimeoutRef.current = setTimeout(() => {
			mobileVerificationMutation.mutate({
				mobileNumber,
				...(typeof kycNumber !== "undefined" ? { kycNumber } : {}),
			});
		}, DEBOUNCE_DELAY);
	}, [
		mobileNumber,
		kycNumber,
		mobileVerificationMutation,
		setMobileVerification,
		queryClient,
	]);

	useEffect(() => {
		performMobileVerification();
		return () => {
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}
		};
	}, [performMobileVerification]);

	return (
		<>
			<h2 className="text-xl font-bold text-gray-800 mb-6">
				General Information
			</h2>

			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
				<div className="mb-4 space-y-2">
					{clientVerificationMutation.isPending && (
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
							<div className="flex items-center">
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
								<p className="text-sm text-blue-800">
									Verifying client information...
								</p>
							</div>
						</div>
					)}

					{mobileVerificationMutation.isPending && (
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
							<div className="flex items-center">
								<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
								<p className="text-sm text-blue-800">
									Verifying mobile number...
								</p>
							</div>
						</div>
					)}
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					{/* {!kycNumberData && ( */}

					<div className="space-y-2">
						<FormInput
							form={form}
							name="firstName"
							type="text"
							placeholder="Enter first name"
							label="First Name"
							required={true}
							onKeyDown={useOnlyAlphabets()}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="middleName"
							type="text"
							placeholder="Enter Middle Name"
							label="Middle Name"
							onKeyDown={useOnlyAlphabets()}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="lastName"
							type="text"
							placeholder="Enter Last Name"
							label="Last Name"
							required={true}
							onKeyDown={useOnlyAlphabets()}
						/>
					</div>
					<DateConverter
						form={form}
						name="dateOfBirth"
						labelNep="DOB in BS"
						labelEng="DOB in AD"
					/>
					<div className="space-y-2">
						<FormInput
							disabled={true}
							form={form}
							name="age"
							type="text"
							placeholder={calculatedAge ? "Calculating..." : "Age"}
							label="Age"
							required={true}
						/>
					</div>
					<div className="space-y-2">
						<FormInput
							form={form}
							name="fatherName"
							type="text"
							placeholder="Father Name"
							label="Father Name"
							required={true}
							onKeyDown={useOnlyAlphabets()}
						/>
					</div>
					<div className="space-y-2">
						<FormSelect
							name="gender"
							options={kycRequiredFields?.genderList}
							label="Gender"
							caption="Select Gender"
							form={form}
							required={true}
						/>
					</div>

					<div className="space-y-2">
						<FormCombo
							name="permanentDistrict"
							options={kycRequiredFields?.districtList}
							label="District"
							form={form}
							required={true}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="mobileNumber"
							type="text"
							placeholder="9XXXXXXXXX"
							label="Mobile Number"
							required={true}
							maxLength={10}
							onKeyDown={useOnlyNumbers()}
						/>
					</div>

					{/* )} */}
				</div>
			</div>
		</>
	);
}
