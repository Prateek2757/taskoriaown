"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import FormSelect from "@/components/formElements/FormSelect";
import {
	ConvertPolicySchema,
	ConvertPolicyDTO,
} from "./schemas/convertPolicySchema";
import RowField from "@/app/(admin)/policy-service/surrender/components/RowField";

// Mock data for KYC options
const kycOptions: SelectOption[] = [
	{
		value: "kyc001",
		text: "KYC001 - John Doe",
		disabled: false,
		group: "",
		selected: false,
	},
	{
		value: "kyc002",
		text: "KYC002 - Jane Smith",
		disabled: false,
		group: "",
		selected: false,
	},
	{
		value: "kyc003",
		text: "KYC003 - Binod Thedi Magar",
		disabled: false,
		group: "",
		selected: false,
	},
];

// Mock data for insured details (would be fetched based on KYC selection)
const mockInsuredDetails = {
	groupCode: "GE520002",
	policyNo: "300001238",
	dob: "1995-09-27",
	doc: "2024-04-15",
	term: "20",
	basicPremium: "8386.0000",
	totalRiderPremium: "180.0000",
	groupName: "Global IME Bank Ltd.",
	insuredName: "Binod Thedi Magar",
	age: "29",
	nextDueDate: "20",
	payTerm: "20",
	premium: "7881.0000",
	totalInstallment: "1",
};

const page = () => {
	const [selectedKyc, setSelectedKyc] = useState<string>("");
	const [insuredDetails, setInsuredDetails] = useState<any>(null);

	const form = useForm<ConvertPolicyDTO>({
		resolver: zodResolver(ConvertPolicySchema),
		defaultValues: {
			kycNo: "",
			groupCode: "",
			policyNo: "",
			dob: "",
			doc: "",
			term: "",
			basicPremium: "",
			totalRiderPremium: "",
			groupName: "",
			insuredName: "",
			age: "",
			nextDueDate: "",
			payTerm: "",
			premium: "",
			totalInstallment: "",
		},
	});

	const handleKycChange = (kycNo: string) => {
		setSelectedKyc(kycNo);
		// Simulate fetching insured details based on KYC selection
		if (kycNo === "kyc003") {
			setInsuredDetails(mockInsuredDetails);
			// Update form with the fetched data
			Object.entries(mockInsuredDetails).forEach(([key, value]) => {
				form.setValue(key as keyof ConvertPolicyDTO, value);
			});
		} else {
			setInsuredDetails(null);
			// Clear form fields
			Object.keys(mockInsuredDetails).forEach((key) => {
				form.setValue(key as keyof ConvertPolicyDTO, "");
			});
		}
	};

	// Watch for KYC No changes
	const kycNo = form.watch("kycNo");

	useEffect(() => {
		if (kycNo) {
			handleKycChange(kycNo);
		}
	}, [kycNo]);

	const onSubmit = (data: ConvertPolicyDTO) => {
		console.log("Convert Policy Data:", data);
	};

	return (
		<FormProvider {...form}>
			<div className="w-full p-6">
				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6">
					<h2 className="text-xl font-bold text-gray-800 mb-6">
						Convert Policy
					</h2>

					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{/* KYC No Selection */}
						<div className="mb-8">
							<FormSelect
								name="kycNo"
								label="KYC No"
								form={form}
								options={kycOptions}
								caption="Select KYC No"
								required
							/>
						</div>

						{/* INSURED DETAILS Section */}
						{/* {insuredDetails && ( */}
						<div className="mb-8"></div>
						<div className="gap-6">
							{/* Proposal Details */}
							<div className="bg-white rounded-lg shadow-sm border relative overflow-hidden">
								{/* Background Pattern */}

								<div className=" bg-blue-50 px-4 py-3">
									<h2 className="text-lg font-semibold text-gray-900">
										INSURED DETAILS
									</h2>
								</div>
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
									<div className="px-6 py-4 space-y-3 relative z-10">
										<RowField
											label={"Group Code"}
											value={insuredDetails?.policyNumber}
										/>
										<RowField
											label={"Policy No"}
											value={insuredDetails?.branchCode}
										/>

										<RowField
											label={"Date of birth"}
											value={insuredDetails?.fullName}
										/>

										<RowField
											label={"Date of commencement"}
											value={insuredDetails?.dateOfBirth}
										/>

										<RowField label={"Term"} value={insuredDetails?.address} />

										<RowField
											label={"Basic Premium"}
											value={insuredDetails?.mobileNumber}
										/>
										<RowField
											label={"Total Rider Premium"}
											value={insuredDetails?.nomineeName}
										/>
									</div>
									<div className="px-6 py-4 space-y-3 relative z-10">
										<RowField
											label={"Group Name"}
											value={insuredDetails?.policyNumber}
										/>
										<RowField
											label={"Insured Name"}
											value={insuredDetails?.branchCode}
										/>

										<RowField label={"Age"} value={insuredDetails?.fullName} />

										<RowField
											label={"Next Due Date"}
											value={insuredDetails?.dateOfBirth}
										/>

										<RowField
											label={"Pay Term"}
											value={insuredDetails?.address}
										/>

										<RowField
											label={"Premium"}
											value={insuredDetails?.mobileNumber}
										/>
										<RowField
											label={"Total Installment"}
											value={insuredDetails?.nomineeName}
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Convert Policy Button */}
						<div className="flex justify-start pt-4">
							<Button
								type="submit"
								className="bg-gradient-to-r bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
								// disabled={!insuredDetails}
							>
								<span className="flex items-center gap-2">Convert Policy</span>
							</Button>
						</div>
					</form>
				</div>
			</div>
		</FormProvider>
	);
};

export default page;
