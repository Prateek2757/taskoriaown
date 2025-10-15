"use client";
import { Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import FormCombo from "@/components/formElements/FormCombo";
import FormInput from "@/components/formElements/FormInput";
import FormInputNepali from "@/components/formElements/FormInputNepali";
import { Button } from "@/components/ui/button";
import type { AddProposalDTO } from "../proposalSchema";
import { emptyNominee } from "../proposalSchema";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface ProposalDetailProps {
	form: UseFormReturn<AddProposalDTO>;
	selectdata: ProposalRequiredFields;
	data?: any;
}
export default function NomineeDetail({
	form,
	selectdata,
	data,
}: ProposalDetailProps) {
	console.log("sudeep nominee", data);
	useEffect(() => {
		if (data?.nomineeList && Array.isArray(data.nomineeList)) {
			const mappedNominees = data.nomineeList.map(
				(
					doc: {
						name: string;
						nameLocal: string;
						address: string;
						addressLocal: string;
						fatherName: string;
						fatherNameLocal: string;
						relation: string;
					},
					index: number,
				) => ({
					id: index + 1,
					name: doc.name || "",
					nameLocal: doc.nameLocal || "",
					address: doc.address || "",
					addressLocal: doc.addressLocal || "",
					fatherName: doc.fatherName || "",
					fatherNameLocal: doc.fatherNameLocal || "",
					relation: doc.relation || "",
				}),
			);
			form.setValue("nomineeList", mappedNominees);
			setNominees(mappedNominees);
		}
	}, [data, form]);
	const [nominees, setNominees] = useState(() => {
		const formNominees = form.getValues("nomineeList") || [];
		if (formNominees.length === 0) {
			return [
				{
					id: 1,
					...emptyNominee,
				},
			];
		}
		return formNominees.map((nominee, index) => ({
			...nominee,
			id: index + 1,
		}));
	});

	const resetNomineeFields = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const index = e.target.name.split(".")[1];
		if (index == null) return;
		console.log("resetting nominee", {
			...emptyNominee,
			relation: e.target.value,
		});

		form.setValue(`nomineeList.${index}`, {
			...emptyNominee,
			relation: e.target.value,
		});
	};

	const addNominee = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (e && (e as unknown as React.KeyboardEvent).key === "Enter") {
			return;
		}
		const currentNominees = form.getValues("nomineeList") || [];
		const newNominee = {
			...emptyNominee,
		};

		const updatedNominees = [...currentNominees, newNominee];
		form.setValue("nomineeList", updatedNominees);
		setNominees((prev) => [
			...prev,
			{
				id: Math.max(...prev.map((n) => n.id), 0) + 1,
				...newNominee,
			},
		]);
	};
	const removeNominee = (id: number) => {
		if (nominees.length > 1) {
			const indexToRemove = nominees.findIndex((nominee) => nominee.id === id);
			const currentNominees = form.getValues("nomineeList") || [];
			const updatedNominees = currentNominees.filter(
				(_, index) => index !== indexToRemove,
			);

			form.setValue("nomineeList", updatedNominees);
			setNominees(nominees.filter((nominee) => nominee.id !== id));
		}
	};

	const getAvailableRelationOptions = (currentIndex: number) => {
		const nomineeList = form.getValues("nomineeList") || [];
		if (!selectdata?.relationList) return [];
		const currentRelation = nomineeList[currentIndex]?.relation;
		return selectdata.relationList.filter((option) => {
			if (option.value === currentRelation) return true;
			return !nomineeList.some(
				(nom, i) => i !== currentIndex && nom.relation === option.value,
			);
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Nominee Detail</CardTitle>
				<CardAction>
					<Button
						type="button"
						tabIndex={0}
						onClick={addNominee}
						// onKeyDown={(e) => {
						//   if (e.key === "Enter" || e.key === " " || e.keyCode === 13) {
						//     e.preventDefault();
						//     e.stopPropagation();

						//   }
						// }}
						className="cursor-pointer"
					>
						<Plus />
						Add Nominee
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
					{nominees.map((nominee, index) => {
						const availableRelations = getAvailableRelationOptions(index);
						return (
							<div
								key={nominee.id}
								className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6"
							>
								<div className="space-y-2">
									<FormCombo
										form={form}
										name={`nomineeList.${index}.relation`}
										options={availableRelations}
										label={`Relation`}
										required={true}
										onChange={resetNomineeFields}
									/>
								</div>

								<div className="space-y-2">
									<FormInput
										form={form}
										name={`nomineeList.${index}.name`}
										type="text"
										placeholder={`Enter Name`}
										label={`Name`}
										required={true}
									/>
								</div>

								<div className="space-y-2">
									<FormInputNepali
										form={form}
										name={`nomineeList.${index}.nameLocal`}
										type="text"
										placeholder={`Enter Name in Nepali`}
										label={`Name in Nepali`}
										required={true}
									/>
								</div>

								<div className="space-y-2">
									<FormInput
										form={form}
										name={`nomineeList.${index}.address`}
										type="text"
										placeholder={`Enter Address`}
										label={`Address`}
										required={true}
									/>
								</div>

								<div className="space-y-2">
									<FormInputNepali
										form={form}
										name={`nomineeList.${index}.addressLocal`}
										type="text"
										placeholder={`Enter Address in Nepali`}
										label={`Address in Nepali`}
										required={true}
									/>
								</div>

								<div className="space-y-2">
									<FormInput
										form={form}
										name={`nomineeList.${index}.fatherName`}
										type="text"
										placeholder={`Enter Father Name`}
										label={`Father Name`}
										required={true}
									/>
								</div>

								<div className="space-y-2">
									<FormInputNepali
										form={form}
										name={`nomineeList.${index}.fatherNameLocal`}
										type="text"
										placeholder={`Enter Father Name in Nepali`}
										label={`Father Name in Nepali`}
										required={true}
									/>
								</div>
								<div className="space-y-2">
									{nominees.length > 1 && (
										<Button
											type="button"
											tabIndex={0}
											onClick={() => removeNominee(nominee.id)}
											variant={"destructive"}
											className="mt-7"
										>
											<Trash />
											Remove
										</Button>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
