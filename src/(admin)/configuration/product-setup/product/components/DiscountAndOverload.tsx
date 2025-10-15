"use client";
import { Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import FormSelect from "@/components/formElements/FormSelect";
import FormInput from "@/components/formElements/FormInput";
import { Button } from "@/components/ui/button";
import type { AddEditProductDTO } from "../ProductSchema";
import { emptyPayMode, emptySaRate } from "../ProductSchema";

type DiscountAndOverloadProps = {
	form: UseFormReturn<AddEditProductDTO>;
	productRequirements?: KycRequiredFields;
	data?: any;
};

export default function DiscountAndOverload({
	form,
	productRequirements,
	data,
}: DiscountAndOverloadProps) {
	useEffect(() => {
		if (data?.payModeList && Array.isArray(data.payModeList)) {
			const mapped = data.payModeList.map(
				(
					doc: { payMode: string; payModeType: string; payModeValue: string },
					index: number,
				) => ({
					id: index + 1,
					payMode: doc.payMode || "",
					payModeType: doc.payModeType || "",
					payModeValue: doc.payModeValue || "",
				}),
			);
			form.setValue("payModeList", mapped);
			setPayModes(mapped);
		}
	}, [data, form]);

	const [payModes, setPayModes] = useState(() => {
		const formValues = form.getValues("payModeList") || [];
		if (formValues.length === 0) return [{ id: 1, ...emptyPayMode }];
		return formValues.map((pm, i) => ({ id: i + 1, ...pm }));
	});

	const addPayMode = () => {
		const current = form.getValues("payModeList") || [];
		const newRow = { ...emptyPayMode };
		const updated = [...current, newRow];
		form.setValue("payModeList", updated);
		setPayModes((prev) => [
			...prev,
			{ id: Math.max(...prev.map((p) => p.id), 0) + 1, ...newRow },
		]);
	};

	const removePayMode = (id: number) => {
		if (payModes.length > 1) {
			const index = payModes.findIndex((p) => p.id === id);
			const current = form.getValues("payModeList") || [];
			const updated = current.filter((_, i) => i !== index);
			form.setValue("payModeList", updated);
			setPayModes(payModes.filter((p) => p.id !== id));
		}
	};

	useEffect(() => {
		if (data?.saRates && Array.isArray(data.saRates)) {
			const mapped = data.saRates.map(
				(
					doc: {
						minSA: number;
						maxSA: number;
						saType: string;
						saValue: string;
					},
					index: number,
				) => ({
					id: index + 1,
					minSA: doc.minSA || 0,
					maxSA: doc.maxSA || 0,
					saType: doc.saType || "",
					saValue: doc.saValue || "",
				}),
			);
			form.setValue("saRates", mapped);
			setSaRates(mapped);
		}
	}, [data, form]);

	const [saRates, setSaRates] = useState(() => {
		const formValues = form.getValues("saRates") || [];
		if (formValues.length === 0) return [{ id: 1, ...emptySaRate }];
		return formValues.map((sa, i) => ({ id: i + 1, ...sa }));
	});

	const addSaRate = () => {
		const current = form.getValues("saRates") || [];
		const newRow = { ...emptySaRate };
		const updated = [...current, newRow];
		form.setValue("saRates", updated);
		setSaRates((prev) => [
			...prev,
			{ id: Math.max(...prev.map((s) => s.id), 0) + 1, ...newRow },
		]);
	};

	const removeSaRate = (id: number) => {
		if (saRates.length > 1) {
			const index = saRates.findIndex((s) => s.id === id);
			const current = form.getValues("saRates") || [];
			const updated = current.filter((_, i) => i !== index);
			form.setValue("saRates", updated);
			setSaRates(saRates.filter((s) => s.id !== id));
		}
	};

	return (
		<div className="bg-white rounded-lg border mb-6 mt-4">
			<div className="p-6 space-y-8">
				<div className="border rounded-lg">
					<div className="px-4 py-2 font-semibold">
						<span>Pay Mode</span>
					</div>
					<div className="flex gap-4 border-y font-semibold px-4 py-2 bg-gray-100/50">
						<div className="flex-1">
							<span className="text-sm text-gray-600">Pay Mode</span>
						</div>
						<div className="flex-1">
							<span className="text-sm text-gray-600">Type</span>
						</div>
						<div className="flex-1">
							<span className="text-sm text-gray-600">Value</span>
						</div>
						<div className="w-[36px]"></div>
					</div>
					{payModes.map((_, index) => (
						<div
							key={payModes[index].id}
							className="flex gap-4 px-4 py-2 items-center"
						>
							<div className="flex-1">
								<FormSelect
									options={productRequirements?.payModeList || []}
									form={form}
									name={`payModeList.${index}.payMode`}
									caption="Select Pay Mode"
								/>
							</div>
							<div className="flex-1">
								<FormSelect
									options={productRequirements?.discountTypes || []}
									form={form}
									name={`payModeList.${index}.payModeType`}
									caption="Select Type"
								/>
							</div>
							<div className="flex-1">
								<FormInput
									form={form}
									name={`payModeList.${index}.payModeValue`}
									type="number"
									placeholder="Enter Value"
								/>
							</div>
							<div className="w-[36px]">
								{payModes.length > 1 && (
									<Button
										type="button"
										variant="destructive"
										onClick={() => removePayMode(payModes[index].id)}
										size={"icon"}
										title="Remove Item"
									>
										<Trash />
									</Button>
								)}
							</div>
						</div>
					))}
					<div className="border-t-1 flex justify-end items-center px-4 py-2 font-semibold">
						<Button type="button" onClick={addPayMode}>
							<Plus /> Add Pay Mode
						</Button>
					</div>
				</div>

				<div className="border rounded-lg">
					<div className="px-4 py-2 font-semibold">
						<span>SA Rates</span>
					</div>
					<div className="flex gap-4 border-y font-semibold px-4 py-2 bg-gray-100/50">
						<div className="flex-1">
							<span className="text-sm text-gray-600">Min SA</span>
						</div>
						<div className="flex-1">
							<span className="text-sm text-gray-600">Max SA</span>
						</div>
						<div className="flex-1">
							<span className="text-sm text-gray-600">Type</span>
						</div>
						<div className="flex-1">
							<span className="text-sm text-gray-600">Value</span>
						</div>
						<div className="w-[36px]"></div>
					</div>
					{saRates.map((_, index) => (
						<div
							key={saRates[index].id}
							className="flex gap-4 px-4 py-2 items-center"
						>
							<div className="flex-1">
								<FormInput
									form={form}
									name={`saRates.${index}.minSA`}
									type="number"
									placeholder="0"
								/>
							</div>
							<div className="flex-1">
								<FormInput
									form={form}
									name={`saRates.${index}.maxSA`}
									type="number"
									placeholder="0"
								/>
							</div>
							<div className="flex-1">
								<FormSelect
									options={productRequirements?.discountTypes || []}
									form={form}
									name={`saRates.${index}.saType`}
									caption="Select Type"
								/>
							</div>
							<div className="flex-1">
								<FormInput
									form={form}
									name={`saRates.${index}.saValue`}
									type="number"
									placeholder="0"
								/>
							</div>
							<div className="w-[36px]">
								{saRates.length > 1 && (
									<Button
										type="button"
										variant="destructive"
										onClick={() => removeSaRate(saRates[index].id)}
										size={"icon"}
										title="Remove Item"
									>
										<Trash />
									</Button>
								)}
							</div>
						</div>
					))}
					<div className="border-t-1 flex justify-end items-center px-4 py-2 font-semibold">
						<Button type="button" onClick={addSaRate}>
							<Plus /> Add SA Rate
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
