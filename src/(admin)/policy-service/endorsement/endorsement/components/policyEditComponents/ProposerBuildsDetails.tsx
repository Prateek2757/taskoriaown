"use client";

import { InfoIcon } from "lucide-react";
import { useCallback, useEffect, useState, useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import FormSelect from "@/components/formElements/FormSelect";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import type { AddProposalDTO } from "../proposalSchema";
import { useOnlyNumbers } from "@/hooks/useInputValidation";
import { apiPostCall, PostCallData } from "@/helper/apiService";
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import debounce from "lodash.debounce";

interface InsuredDetailProps {
	form: UseFormReturn<AddProposalDTO>;
}

interface HabitOption {
	disabled: boolean;
	group: string | null;
	selected: boolean;
	text: string;
	value: string;
}

export default function ProposerBuildDetails({ form }: InsuredDetailProps) {
	const [habitOptions, setHabitOptions] = useState<HabitOption[]>([]);
	const [loadingBMI, setLoadingBMI] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data: PostCallData = { endpoint: "proposal_required_list" };
				const response = await apiPostCall(data);
				if (response?.data && response.status === API_CONSTANTS.success) {
					const activeHabits = response.data.usageTypeHabitList?.filter(
						(item: HabitOption) => item.disabled === false,
					);
					setHabitOptions(activeHabits || []);
				} else {
					console.error("Invalid response format or failed API call");
				}
			} catch (error) {
				console.error("Error fetching habitOption Detail data:", error);
			}
		};
		fetchData();
	}, []);

	const doSmoke = form.watch("insuredMedical.doSmoke");
	const doDrinkAlcohol = form.watch("insuredMedical.doDrinkAlcohol");
	const doUseDrugs = form.watch("insuredMedical.doUseDrugs");

	const HeightInFeet = form.watch("insuredMedical.heightFeet");
	const HeightInInch = form.watch("insuredMedical.heightInch");
	const Weight = form.watch("insuredMedical.weight");

	const bmiValue = form.watch("insuredMedical.BMI");
	const bmiStatus = form.watch("insuredMedical.BMIstatus");

	const getBMI = useCallback(
		async ({
			HeightInFeet,
			HeightInInch,
			Weight,
		}: {
			HeightInFeet: string;
			HeightInInch: string;
			Weight: string;
		}) => {
			try {
				setLoadingBMI(true);
				const submitData: PostCallData & {
					HeightInFeet: string;
					HeightInInch: string;
					Weight: string;
				} = {
					HeightInFeet: HeightInFeet || "",
					HeightInInch: HeightInInch || "",
					Weight: Weight || "",
					endpoint: "proposal_bmi",
				};
				console.log("Kiran Data", submitData);
				const response = await apiPostCall(submitData);
				if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
					form.setValue("insuredMedical.BMI", response.data.bmiResult);
					form.setValue("insuredMedical.BMIstatus", response.data.bmiStatus);
				} else {
					form.setValue("insuredMedical.BMI", "");
					form.setValue("insuredMedical.BMIstatus", "");
				}
			} catch (error) {
				console.error("Error fetching BMI", error);
				form.setValue("insuredMedical.BMI", "");
				form.setValue("insuredMedical.BMIstatus", "");
			} finally {
				setLoadingBMI(false);
			}
		},
		[form],
	);

	const [lastBMIInput, setLastBMIInput] = useState({
		HeightInFeet: "",
		HeightInInch: "",
		Weight: "",
	});

	const debouncedGetBMI = useMemo(() => debounce(getBMI, 500), [getBMI]);

	useEffect(() => {
		return () => {
			debouncedGetBMI.cancel();
		};
	}, [debouncedGetBMI]);

	useEffect(() => {
		if (!HeightInFeet || !HeightInInch || !Weight) return;

		const isSameAsLast =
			lastBMIInput.HeightInFeet === HeightInFeet &&
			lastBMIInput.HeightInInch === HeightInInch &&
			lastBMIInput.Weight === Weight;

		if (!isSameAsLast) {
			setLastBMIInput({
				HeightInFeet,
				HeightInInch,
				Weight,
			});

			debouncedGetBMI({ HeightInFeet, HeightInInch, Weight });
		}
	}, [HeightInFeet, HeightInInch, Weight, lastBMIInput, debouncedGetBMI]);

	useEffect(() => {
		if (!HeightInFeet || !HeightInInch) return;

		const feet = parseInt(HeightInFeet, 10);
		const inch = parseInt(HeightInInch, 10);

		if (!isNaN(feet) && !isNaN(inch)) {
			const totalInches = feet * 12 + inch;
			const cm = (totalInches * 2.54).toFixed(2);
			form.setValue("insuredMedical.heightInCM", cm);
		}
	}, [HeightInFeet, HeightInInch, form]);
	return (
		<div className="bg-white rounded-lg border mb-6 mt-4 justify-start">
			<div className="p-6">
				<div className="flex justify-between items-center mb-8">
					<h2 className="text-xl font-bold text-gray-700">
						Proposer Build Details
					</h2>
					{bmiStatus && (
						<div
							className={`flex items-center gap-2 px-4 py-1.5 border text-sm font-medium rounded-md ${
								bmiStatus === "Normal"
									? "bg-green-50 border-green-300 text-green-700"
									: "bg-red-50 border-red-300 text-red-700"
							}`}
						>
							<InfoIcon
								size={16}
								className={
									bmiStatus === "Normal" ? "text-green-600" : "text-red-600"
								}
							/>
							<span className="font-bold text-base">{bmiValue}</span>
							<span className="text-base">{bmiStatus}</span>
						</div>
					)}

					{loadingBMI && (
						<div
							className="ml-4 text-blue-600 font-medium animate-pulse"
							aria-live="assertive"
						>
							Calculating BMI...
						</div>
					)}
				</div>
				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
					<div className="grid grid-cols-3 gap-4 mb-6">
						<FormSelect
							form={form}
							name="insuredMedical.heightFeet"
							label="Height (Feet)"
							options={Array.from({ length: 7 }, (_, i) => ({
								value: String(i + 1),
								text: `${i + 1} ft`,
							}))}
							required
						/>

						<FormSelect
							form={form}
							name="insuredMedical.heightInch"
							label="Height (Inches)"
							options={Array.from({ length: 12 }, (_, i) => ({
								value: String(i),
								text: `${i} in`,
							}))}
							required
						/>

						<FormInput
							form={form}
							name="insuredMedical.weight"
							type="text"
							placeholder="Enter Weight in KG"
							label="Weight (KG)"
							required
						/>
						<div className="hidden">
							<FormInput
								form={form}
								name="insuredMedical.heightInCM"
								type="hidden"
							/>
						</div>
						<div className="flex items-start justify-between gap-4">
							<FormSwitch
								form={form}
								label="Do Smoke?"
								name="insuredMedical.doSmoke"
							/>
							{doSmoke && (
								<div className="mt-1 w-1/2">
									<FormSelect
										form={form}
										name="insuredMedical.smokeUsageType"
										label="Smoking Habit"
										options={habitOptions}
										required
									/>
								</div>
							)}
						</div>
						<div className="flex items-start justify-between gap-4">
							<FormSwitch
								form={form}
								label="Do Drink Alcohol?"
								name="insuredMedical.doDrinkAlcohol"
							/>
							{doDrinkAlcohol && (
								<div className="mt-1 w-1/2">
									<FormSelect
										form={form}
										name="insuredMedical.drinkUsageType"
										label="Drinking Habit"
										options={habitOptions}
										required
									/>
								</div>
							)}
						</div>
						<div className="flex items-start justify-between gap-4">
							<FormSwitch
								form={form}
								label="Do you use drugs?"
								name="insuredMedical.doUseDrugs"
							/>
							{doUseDrugs && (
								<div className="mt-1 w-1/2">
									<FormSelect
										form={form}
										name="insuredMedical.drugsUsageType"
										label="Drug Use Habit"
										options={habitOptions}
										required
									/>
								</div>
							)}
						</div>
					</div>
				</div>
				<FormInput form={form} name="insuredMedical.BMI" type="hidden" />
				<FormInput form={form} name="insuredMedical.BMIstatus" type="hidden" />
			</div>
		</div>
	);
}
