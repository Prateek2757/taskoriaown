import { Info } from "lucide-react";
import { useEffect } from "react";
import { type UseFormReturn, useFormContext, useWatch } from "react-hook-form";
import FormCheckbox from "@/components/formElements/FormCheckbox";
import FormInput from "@/components/formElements/FormInput";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { commaSeparationNumber } from "@/components/utils/commaSeparationNumber";
import { cn } from "@/lib/utils";
import type { PremiumDTO, RiderDTO } from "../premiumSchema";

interface RiderListProps {
	riderList?: RiderDTO[];
	form: UseFormReturn<PremiumDTO>;
}

export default function RiderList({ riderList, form }: RiderListProps) {
	const { setValue, clearErrors } = useFormContext();

	const watchedValues = useWatch({
		name: "ridersList",
		control: form.control,
	});

	const mainSumAssured = form.watch("sumAssured");
	const mainTerm = form.watch("term");
	const age = form.watch("age");
	const mainPayTerm = form.watch("payTerm");

	const getCalculatedValue = (mainValue: number, riderMax?: number) => {
		if (!mainValue) return "";

		let calculatedValue = mainValue;

		if (riderMax !== undefined && calculatedValue > riderMax) {
			calculatedValue = riderMax;
		} else {
			calculatedValue = mainValue;
		}

		return calculatedValue.toString();
	};

	const isSpecificRiderSelectable = (
		mainTerm: number,
		rider: RiderDTO,
		age: number,
	) => {
		if (!rider.riderMaximumAgeAtMaturity || !age) return true;
		const minTerm = rider.riderMaximumAgeAtMaturity - age;
		return minTerm >= mainTerm;
	};

	const handleRiderSelection = (riderIndex: number, checked: boolean) => {
		setValue(`riderList.${riderIndex}.isSelected`, checked);
		if (!checked) {
			clearErrors(`riderList.${riderIndex}.sumAssured`);
			clearErrors(`riderList.${riderIndex}.term`);
			clearErrors(`riderList.${riderIndex}.payTerm`);
		}
	};

	useEffect(() => {
		if (riderList && riderList.length > 0 && !watchedValues) {
			const initialRiderData = riderList.map((rider) => ({
				...rider,
				isSelected: false,
			}));
			setValue("riderList", initialRiderData);
		}
	}, [riderList, setValue, watchedValues]);

	return (
		<>
			{riderList && riderList.length > 0 && (
				<div className="p-6 border border-dashed border-gray-400 rounded-lg">
					<h3 className="text-lg font-semibold mb-4">Select Rider</h3>
					<div className="">
						{riderList.map((rider, index) => {
							const isSelected = watchedValues?.[index]?.isSelected === true;
							const riderSelectable = isSpecificRiderSelectable(
								Number(mainTerm),
								rider,
								Number(age),
							);

							const defaultSumAssured = getCalculatedValue(
								Number(mainSumAssured),
								Number(rider.maximumSumAssured),
							);
							const defaultTerm = getCalculatedValue(
								Number(mainTerm),
								Number(rider.maximumTerm),
							);
							const defaultPayTerm = getCalculatedValue(
								Number(mainPayTerm),
								Number(rider.maximumPayTerm),
							);
							return (
								<div
									key={rider.rider}
									className={cn(
										"mb-2 border border-solid border-gray-100 rounded-lg",
										isSelected
											? "rounded-sm  border-blue-100 bg-blue-400/5"
											: "",
									)}
								>
									<div className=" flex flex-col gap-4">
										<div
											className={cn(
												"border-0 border-b-1 border-transparent flex p-6 items-center gap-3 justify-start",
												isSelected
													? "rounded-sm border-0 border-b-1  border-blue-200 bg-blue-500/10"
													: "",
											)}
										>
											<FormInput
												type="hidden"
												form={form}
												name={`ridersList.${index}.rider`}
												value={rider.rider}
											/>
											{riderSelectable ? (
												<FormCheckbox
													form={form}
													name={`ridersList.${index}.isSelected`}
													onCheckedChange={(checked) =>
														handleRiderSelection(index, checked)
													}
													label={`${rider.riderName} (${rider.rider})`}
												/>
											) : (
												<span className="text-sm ml-6">
													{rider.riderName}{" "}
													<span className="text-red-600">- Not Available</span>
													<small
														className={cn(
															"border-1 border-red-300  p-2 ppy-1 rounded-lg ml-3",
														)}
													>
														Max Age At Maturity :{" "}
														<b className="text-red-400">
															{rider.riderMaximumAgeAtMaturity}
														</b>
													</small>
												</span>
											)}

											<Tooltip>
												<TooltipTrigger asChild>
													<button type="button" className="cursor-pointer">
														<Info size={20} className="text-blue-600" />
													</button>
												</TooltipTrigger>
												<TooltipContent side="left" className="w-md">
													<p className=" text-sm">{rider.riderDescription}</p>
												</TooltipContent>
											</Tooltip>
											<small
												className={cn("text-xs", isSelected ? "" : "hidden")}
											>
												{rider.note}
											</small>
											<small
												className={cn(
													"border-1 border-red-300  p-2 ppy-1 rounded-lg",
													isSelected ? "" : "hidden",
												)}
											>
												Max Age At Maturity :{" "}
												<b className="text-red-400">
													{rider.riderMaximumAgeAtMaturity}
												</b>
											</small>
										</div>
										<div
											className={cn(
												"grid grid-cols-3 gap-4 px-6 py-4",
												isSelected ? "" : "hidden",
											)}
										>
											<div>
												<FormInput
													form={form}
													name={`ridersList.${index}.sumAssured`}
													type="text"
													placeholder="Enter Sum Assured"
													required={isSelected}
													value={defaultSumAssured}
												/>
												<small className="text-xs">
													Sum Assured:{" "}
													{commaSeparationNumber(rider.minimumSumAssured ?? 0)}{" "}
													-{" "}
													{commaSeparationNumber(rider.maximumSumAssured ?? 0)}
												</small>
												<FormInput
													type="hidden"
													form={form}
													name={`ridersList.${index}.defaultSumAssured`}
													value={defaultSumAssured}
												/>
												<FormInput
													type="hidden"
													form={form}
													name={`ridersList.${index}.minimumSumAssured`}
													value={rider.minimumSumAssured}
												/>
												<FormInput
													type="hidden"
													form={form}
													name={`ridersList.${index}.maximumSumAssured`}
													value={rider.maximumSumAssured}
												/>
											</div>

											<div>
												<FormInput
													form={form}
													name={`ridersList.${index}.term`}
													type="text"
													placeholder="Enter Term"
													disabled={true}
													required={isSelected}
													value={defaultTerm}
												/>
												<small className="text-xs">
													Term: {rider.minimumTerm} - {rider.maximumTerm}
												</small>
												<FormInput
													type="hidden"
													form={form}
													name={`ridersList.${index}.defaultTerm`}
													value={defaultTerm}
												/>
												<FormInput
													type="hidden"
													form={form}
													name={`ridersList.${index}.minimumTerm`}
													value={rider.minimumTerm}
												/>
												<FormInput
													type="hidden"
													form={form}
													name={`ridersList.${index}.maximumTerm`}
													value={rider.maximumTerm}
												/>
											</div>

											<div>
												<FormInput
													form={form}
													name={`ridersList.${index}.payTerm`}
													type="text"
													placeholder="Enter Pay Term"
													disabled={true}
													required={isSelected}
													value={defaultPayTerm}
												/>
												<small className="text-xs">
													PayTerm: {rider.minimumPayTerm} -{" "}
													{rider.maximumPayTerm}
												</small>
												<FormInput
													type="hidden"
													form={form}
													name={`ridersList.${index}.defaultPayTerm`}
													value={defaultPayTerm}
												/>
												<FormInput
													type="hidden"
													form={form}
													name={`ridersList.${index}.minimumPayTerm`}
													value={rider.minimumPayTerm}
												/>
												<FormInput
													type="hidden"
													form={form}
													name={`ridersList.${index}.maximumPayTerm`}
													value={rider.maximumPayTerm}
												/>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</>
	);
}
