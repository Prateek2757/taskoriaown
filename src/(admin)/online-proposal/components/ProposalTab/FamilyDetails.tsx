import { Plus, Trash } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { AddOnlineProposalDTO } from "@/app/(admin)/online-proposal/onlineProposalSchema";
import FormCombo from "../../../../../components/formElements/FormCombo";
import FormInput from "../../../../../components/formElements/FormInput";
import { Button } from "../../../../../components/ui/button";
import { useOnlyAlphabets, useOnlyNumbers } from "@/hooks/useInputValidation";

type FamilyDetailsProps = {
	form: UseFormReturn<AddOnlineProposalDTO>;
	proposalRequiredFields: ProposalRequiredFields | undefined;
	locale?: "en" | "ne"; // Optional locale prop, if needed
	onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
};
export default function FamilyDetails({
	form,
	proposalRequiredFields,
	locale,
}: FamilyDetailsProps) {
	const [married, setMarried] = useState(false);
	const [nominees, setNominees] = useState(() => {
		const formNominees = form.getValues("nomineeList") || [];
		if (formNominees.length === 0) {
			return [
				{
					id: 1,
					relation: "",
					name: "",
					address: "",
					mobileNumber: "",
				},
			];
		}

		return formNominees.map((nominee, index) => ({
			...nominee,
			id: index + 1,
		}));
	});

	const selectedRelations =
		form.watch("nomineeList")?.map((nominee) => nominee.relation) || [];

	const getAvailableRelationOptions = (currentIndex: number) => {
		if (!proposalRequiredFields?.relationList) return [];

		const currentRelation = form.getValues(
			`nomineeList.${currentIndex}.relation`,
		);

		return proposalRequiredFields.relationList.filter((option) => {
			if (option.value === currentRelation) return true;

			return !selectedRelations.includes(option.value);
		});
	};

	const addNominee = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const currentNominees = form.getValues("nomineeList") || [];
		const newNominee = {
			name: "",
			relation: "",
			address: "",
			mobileNumber: "",
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

	const maritalStatus = form.watch("maritalStatus");
	useEffect(() => {
		if (maritalStatus === "UMRD") {
			setMarried(true);
			form.setValue("spouseName", " ");
			form.setValue("sonName", " ");
			form.setValue("daughterName", " ");
		}
	}, [maritalStatus]);

	const fatherName = form.watch("fatherName");
	const motherName = form.watch("motherName");
	const spouseName = form.watch("spouseName");

	const onlyAlphabets = useOnlyAlphabets();
	const onlyNumbers = useOnlyNumbers();

	const relationChange = (e) => {
		const relationValue = e.target.value;
		const str = e.target.name;
		const index = str.split(".")[1];

		const currentNominees = form.getValues("nomineeList") || [];
		const isAlreadySelected = currentNominees.some(
			(nominee, i) =>
				i !== parseInt(index) && nominee.relation === relationValue,
		);

		if (isAlreadySelected) {
			form.setError(`nomineeList.${index}.relation`, {
				type: "manual",
				message: "This relation is already selected for another nominee",
			});
			return;
		}
		form.clearErrors(`nomineeList.${index}.relation`);

		switch (relationValue) {
			case "FTR":
				if (index !== null) {
					form.setValue(`nomineeList.${index}.name`, fatherName);
				}
				break;

			case "MTR":
				if (index !== null) {
					form.setValue(`nomineeList.${index}.name`, motherName);
				}
				break;

			case "W":
				if (index !== null) {
					form.setValue(`nomineeList.${index}.name`, spouseName ?? "");
				}
				break;

			default:
				if (index !== null) {
					form.setValue(`nomineeList.${index}.name`, "");
				}
				break;
		}
	};

	return (
		<>
			<h2 className="text-xl font-bold text-gray-800 mb-6">
				{` ${locale === "ne" ? "पारिवारिक विवरण" : "Family Details"}`}
			</h2>

			<div className=" border-blue-200 rounded-lg pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="space-y-2">
						<FormInput
							form={form}
							name="fatherName"
							type="text"
							placeholder={`${
								locale === "ne" ? "बाबुको नाम लेख्नुहोस्" : "Enter Father Name"
							}`}
							label={`${locale === "ne" ? "बाबुको नाम" : "Father Name"}`}
							required={true}
							onKeyDown={onlyAlphabets}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="motherName"
							type="text"
							placeholder={`${
								locale === "ne" ? "आमाको नाम लेख्नुहोस्" : "Enter Mother Name"
							}`}
							label={`${locale === "ne" ? "आमाको नाम" : "Mother Name"}`}
							required={true}
							onKeyDown={onlyAlphabets}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							form={form}
							name="grandFatherName"
							type="text"
							placeholder={`${
								locale === "ne"
									? "हजुरबुबाको नाम लेख्नुहोस्"
									: "Enter Grand Father Name"
							}`}
							label={`${
								locale === "ne" ? "हजुरबुबाको नाम" : "Grand Father Name"
							}`}
							required={true}
							onKeyDown={onlyAlphabets}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							disabled={married}
							form={form}
							name="spouseName"
							type="text"
							placeholder={`${
								locale === "ne" ? "पत्नी/पतिको नाम लेख्नुहोस्" : "Enter Spouse Name"
							}`}
							label={`${locale === "ne" ? "पत्नी/पतिको नाम" : "Spouse Name"}`}
							onKeyDown={onlyAlphabets}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							disabled={married}
							form={form}
							name="sonName"
							type="text"
							placeholder={`${
								locale === "ne" ? "छोराको नाम लेख्नुहोस्" : "Enter Son Name"
							}`}
							label={`${locale === "ne" ? "छोराको नाम" : "Son Name"}`}
							onKeyDown={onlyAlphabets}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							disabled={married}
							form={form}
							name="daughterName"
							type="text"
							placeholder={`${
								locale === "ne" ? "छोरीको नाम लेख्नुहोस्" : "Enter Daughter Name"
							}`}
							label={`${locale === "ne" ? "छोरीको नाम" : "Daughter Name"}`}
							onKeyDown={onlyAlphabets}
						/>
					</div>
				</div>
			</div>

			<div className="flex justify-between mt-5">
				<h2 className="text-xl font-bold text-gray-800 mb-6">
					{locale === "ne" ? "नामिनी विवरण" : "Nominee Details"}
				</h2>
				<Button onClick={addNominee}>
					<Plus />
					{locale === "ne" ? "नामिनी थप्नुहोस्" : "Add Nominee"}
				</Button>
			</div>

			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
				{nominees.map((nominee, index) => (
					<div
						key={nominee.id}
						className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6"
					>
						<div className="space-y-2">
							<FormCombo
								form={form}
								name={`nomineeList.${index}.relation`}
								options={getAvailableRelationOptions(index)}
								label={`${locale === "ne" ? "सम्बन्ध" : "Relation"}`}
								language={locale}
								onChange={relationChange}
								required={true}
							/>
						</div>

						<div className="space-y-2">
							<FormInput
								form={form}
								name={`nomineeList.${index}.name`}
								type="text"
								// defaultValue=""
								placeholder={`${locale === "ne" ? "नाम लेख्नुहोस्" : "Enter Name"}`}
								label={`${locale === "ne" ? "नाम लेख्नुहोस्" : "Enter Name"}`}
								required={true}
								onKeyDown={onlyAlphabets}
							/>
						</div>

						<div className="space-y-2">
							<FormInput
								form={form}
								name={`nomineeList.${index}.address`}
								type="text"
								required={true}
								placeholder={`${
									locale === "ne" ? "ठेगाना लेख्नुहोस्" : "Enter Address"
								}`}
								label={`${locale === "ne" ? "ठेगाना" : "Address"}`}
								// defaultValue=""
							/>
						</div>

						<div className="space-y-2">
							<FormInput
								form={form}
								name={`nomineeList.${index}.mobileNumber`}
								type="text"
								placeholder={`${
									locale === "ne" ? "मोबाइल नम्बर लेख्नुहोस्" : "Enter Mobile Number"
								}`}
								label={`${locale === "ne" ? "मोबाइल नम्बर" : "Mobile Number"}`}
								maxLength={10}
								onKeyDown={onlyNumbers}
								required={true}
								// defaultValue=""
							/>
						</div>
						<div className="space-y-2">
							{nominees.length > 1 && (
								<Button
									onClick={() => removeNominee(nominee.id)}
									variant={"destructive"}
									className="mt-7"
								>
									<Trash />
									{locale === "ne" ? " हटाउनुहोस्" : "Remove "}
								</Button>
							)}
						</div>
					</div>
				))}
			</div>
		</>
	);
}

// export default FamilyDetails;
