"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import FormSelect from "@/components/formElements/FormSelect";
import FormCombo from "@/components/formElements/FormCombo";
import FormInput from "@/components/formElements/FormInput";
import FormInputFile from "@/components/formElements/FormInputFile";
import { Button } from "@/components/ui/button";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import UseDropDownList from "@/hooks/use-dropdownList";

type DeathClaimFormFields = {
	policyNo: string;
	claimType: string;
	claimBranch: string;
	dateOfDeath: string;
	intimationDate: string;
	deathOf: string;
	placeOfDeath: string;
	causeOfDeath: string;
	claimantName: string;
	claimantRelation: string;
	claimantContact: string;
	claimantAddress: string;
	claimReceivedVia: string;
	photoFile?: File | null;
};

type DeathClaimDetails = {
	policyNo: string;
	insuredName: string;
	dob: string;
	address: string;
	nomineeName: string;
	branch: string;
	product: string;
	sumAssured: string;
	term: string;
	payTerm: string;
	mop: string;
	nextDueDate: string;
	doc: string;
	maturityDate: string;
	otherPolicies: string;
};

type RiderDetail = {
	sn: number;
	rider: string;
	riderSA: string;
	riderPremium: string;
};

type PayeeDetail = {
	payeeName: string;
	payeeBank: string;
	payeeAccount: string;
	payeeAccountName: string;
};

export default function DeathClaimSearch() {
  const [claimData, setClaimData] = useState<DeathClaimDetails | null>(null);
  const [riders, setRiders] = useState<RiderDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [payees, setPayees] = useState<PayeeDetail[]>([]);
  const [policyList, setPolicyList] = useState<SelectOption[]>([]);

	const form = useForm<DeathClaimFormFields>({
		defaultValues: {
			policyNo: "",
			claimType: "",
			claimBranch: "",
			dateOfDeath: "",
			intimationDate: "",
			deathOf: "",
			placeOfDeath: "",
			causeOfDeath: "",
			claimantName: "",
			claimantRelation: "",
			claimantContact: "",
			claimantAddress: "",
			claimReceivedVia: "",
			photoFile: null,
		},
	});

  const { getDataDropdown } = UseDropDownList();

	const claimTypeOptions = [
		{ value: "death", text: "Death Claim" },
		{ value: "maturity", text: "Maturity Claim" },
		{ value: "surrender", text: "Surrender Claim" },
	];

	const branchOptions = [
		{ value: "itahari", text: "Itahari Branch" },
		{ value: "kathmandu", text: "Kathmandu Branch" },
		{ value: "pokhara", text: "Pokhara Branch" },
	];

	const deathOfOptions = [
		{ value: "lifeAssured", text: "Life Assured" },
		{ value: "nominee", text: "Nominee" },
	];

	const claimantRelationOptions = [
		{ value: "spouse", text: "Spouse" },
		{ value: "child", text: "Child" },
		{ value: "parent", text: "Parent" },
		{ value: "sibling", text: "Sibling" },
		{ value: "other", text: "Other" },
	];

	const bankOptions = [
		{ value: "nabil", text: "Nabil Bank" },
		{ value: "himalayan", text: "Himalayan Bank" },
		{ value: "standard", text: "Standard Chartered" },
	];

	const onSubmit = (data: DeathClaimFormFields) => {
		console.log("Form Submitted:", data);
		setLoading(true);

		const dummy: DeathClaimDetails = {
			policyNo: data.policyNo || "POL-1001",
			insuredName: "Sudarshan Bhattarai",
			dob: "1997-01-29",
			address: "Itahari-4, Sunsari",
			nomineeName: "Maya Bhattarai",
			branch: "Itahari Branch",
			product: "Child Endowment Plan",
			sumAssured: "500000",
			term: "20 Years",
			payTerm: "15 Years",
			mop: "Yearly",
			nextDueDate: "2025-12-31",
			doc: "2010-01-01",
			maturityDate: "2030-01-01",
			otherPolicies: "POL-2001, POL-3001",
		};

		const dummyRiders: RiderDetail[] = [
			{
				sn: 1,
				rider: "Accidental Rider",
				riderSA: "100000",
				riderPremium: "500",
			},
			{
				sn: 2,
				rider: "Critical Illness Rider",
				riderSA: "200000",
				riderPremium: "1200",
			},
		];

		setTimeout(() => {
			setClaimData(dummy);
			setRiders(dummyRiders);
			setLoading(false);
		}, 1000);
	};

	const addPayee = () => {
		setPayees([
			...payees,
			{ payeeName: "", payeeBank: "", payeeAccount: "", payeeAccountName: "" },
		]);
	};

	const handlePayeeChange = (
		index: number,
		field: keyof PayeeDetail,
		value: string,
	) => {
		const updated = [...payees];
		updated[index][field] = value;
		setPayees(updated);
	};

	useEffect(() => {
		if (payees.length === 0) addPayee();
	}, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="bg-white border rounded-lg p-6 space-y-6 mt-4">
          <h2 className="text-xl font-bold text-gray-800">
            Claim Details Search
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormCombo
              name="policyNo"
              options={policyList}
              label="Policy Number"
              form={form}
              required={true}
              onSearch={async (value) => {
                await getDataDropdown(
                  value,
                  "PolicyNumberAutoComplete",
                  setPolicyList
                );
              }}
            />
          </div>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm"
          >
            Search
          </Button>
        </div>

				{loading ? (
					<p className="text-center py-4">Loading...</p>
				) : claimData ? (
					<div className="bg-white border rounded-lg p-6 space-y-6 mt-6">
						<div className="border border-dashed border-blue-200 p-4 rounded-md">
							<h3 className="text-lg font-semibold text-gray-700 mb-4">
								Insured Details
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-800">
								<p>
									<strong>Policy No:</strong> {claimData.policyNo}
								</p>
								<p>
									<strong>Branch:</strong> {claimData.branch}
								</p>
								<p>
									<strong>Full Name:</strong> {claimData.insuredName}
								</p>
								<p>
									<strong>DOB:</strong> {claimData.dob}
								</p>
								<p>
									<strong>Address:</strong> {claimData.address}
								</p>
								<p>
									<strong>Nominee Name:</strong> {claimData.nomineeName}
								</p>
							</div>
						</div>

						<div className="border border-dashed border-blue-200 p-4 rounded-md">
							<h3 className="text-lg font-semibold text-gray-700 mb-4">
								Policy Details
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-800">
								<p>
									<strong>Product:</strong> {claimData.product}
								</p>
								<p>
									<strong>Sum Assured:</strong> {claimData.sumAssured}
								</p>
								<p>
									<strong>Term | Pay Term:</strong> {claimData.term} |{" "}
									{claimData.payTerm}
								</p>
								<p>
									<strong>MOP:</strong> {claimData.mop}
								</p>
								<p>
									<strong>Next Due Date:</strong> {claimData.nextDueDate}
								</p>
								<p>
									<strong>DOC | Maturity Date:</strong> {claimData.doc} |{" "}
									{claimData.maturityDate}
								</p>
								<p>
									<strong>Other Policies:</strong> {claimData.otherPolicies}
								</p>
							</div>
						</div>

						<div className="border border-dashed border-blue-200 p-4 rounded-md">
							<h3 className="text-lg font-semibold text-gray-700 mb-4">
								Insured Rider Details
							</h3>
							<table className="w-full border border-gray-200 text-sm">
								<thead className="bg-gray-100">
									<tr>
										<th className="border px-3 py-2 text-left">SN</th>
										<th className="border px-3 py-2 text-left">Rider</th>
										<th className="border px-3 py-2 text-left">Rider SA</th>
										<th className="border px-3 py-2 text-left">
											Rider Premium
										</th>
									</tr>
								</thead>
								<tbody>
									{riders.map((rider) => (
										<tr key={rider.sn}>
											<td className="border px-3 py-2">{rider.sn}</td>
											<td className="border px-3 py-2">{rider.rider}</td>
											<td className="border px-3 py-2">{rider.riderSA}</td>
											<td className="border px-3 py-2">{rider.riderPremium}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<div className="border border-dashed border-blue-200 p-4 rounded-md">
							<h3 className="text-lg font-semibold text-gray-700 mb-4">
								Registration Details
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-800">
								<FormSelect
									form={form}
									name="claimType"
									label="Claim Type"
									caption="Select Claim Type"
									options={claimTypeOptions}
									required
								/>
								<FormSelect
									form={form}
									name="claimBranch"
									label="Claim Branch"
									caption="Select Claim Branch"
									options={branchOptions}
									required
								/>
								<DateConverter
									form={form}
									name="dateOfDeath"
									labelNep="Date of Death (BS)"
									labelEng="Date of Death (AD)"
								/>
								<DateConverter
									form={form}
									name="intimationDate"
									labelNep="Intimation Date (BS)"
									labelEng="Intimation Date (AD)"
								/>
								<FormSelect
									form={form}
									name="deathOf"
									label="Death Of"
									caption="Select Death Of"
									options={deathOfOptions}
									required
								/>
								<FormInput
									form={form}
									name="placeOfDeath"
									type="text"
									placeholder="Enter Place of Death"
									label="Place of Death"
									required
								/>
								<FormInput
									form={form}
									name="causeOfDeath"
									type="text"
									placeholder="Enter Cause of Death"
									label="Cause of Death"
									required
								/>
							</div>
						</div>

						<div className="border border-dashed border-blue-200 p-4 rounded-md">
							<h3 className="text-lg font-semibold text-gray-700 mb-4">
								Claimant Details
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-800">
								<FormInput
									form={form}
									name="claimantName"
									type="text"
									placeholder="Enter Claimant Name"
									label="Claimant Name"
									required
								/>
								<FormSelect
									form={form}
									name="claimantRelation"
									label="Claimant Relation"
									caption="Select Relation"
									options={claimantRelationOptions}
									required
								/>
								<FormInput
									form={form}
									name="claimantContact"
									type="text"
									placeholder="Enter Contact No."
									label="Claimant Contact"
									required
								/>
								<FormInput
									form={form}
									name="claimantAddress"
									type="text"
									placeholder="Enter Claimant Address"
									label="Claimant Address"
									required
								/>
								<FormInput
									form={form}
									name="claimReceivedVia"
									type="text"
									placeholder="Enter Method (e.g., Email, Branch)"
									label="Claim Received Via"
									required
								/>
							</div>
						</div>

						<div className="mt-6">
							<div className="flex justify-between items-center mb-2">
								<h3 className="text-lg font-semibold text-gray-700">
									Payee Details
								</h3>
								<Button
									type="button"
									onClick={addPayee}
									className="bg-green-600 hover:bg-green-700 text-white text-sm"
								>
									Add Payee Details
								</Button>
							</div>
							{payees.map((payee, index) => (
								<div
									key={index}
									className="border border-dashed border-blue-200 p-4 rounded-md mb-4"
								>
									<div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-800">
										<FormInput
											form={form}
											name={`payeeName-${index}`}
											type="text"
											placeholder="Enter Payee Name"
											label="Payee Name*"
											value={payee.payeeName}
											onChange={(e) =>
												handlePayeeChange(index, "payeeName", e.target.value)
											}
											required
										/>
										<FormSelect
											form={form}
											name={`payeeBank-${index}`}
											label="Bank Name*"
											caption="Select Bank"
											options={bankOptions}
											value={payee.payeeBank}
											onValueChange={(value) =>
												handlePayeeChange(index, "payeeBank", value)
											}
											required
										/>
										<FormInput
											form={form}
											name={`payeeAccount-${index}`}
											type="text"
											placeholder="Enter Bank Account No"
											label="Bank Account No*"
											value={payee.payeeAccount}
											onChange={(e) =>
												handlePayeeChange(index, "payeeAccount", e.target.value)
											}
											required
										/>
										<FormInput
											form={form}
											name={`payeeAccountName-${index}`}
											type="text"
											placeholder="Enter Bank Account Name"
											label="Bank Account Name*"
											value={payee.payeeAccountName}
											onChange={(e) =>
												handlePayeeChange(
													index,
													"payeeAccountName",
													e.target.value,
												)
											}
											required
										/>
									</div>
								</div>
							))}
						</div>

						<div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0 mt-6">
							<h2 className="text-xl font-bold text-gray-800 mb-6">Document</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
								<FormInputFile
									form={form}
									name="photoFile"
									label="Photo"
									fileNameField="photoFileName"
									accept=".png,.jpg,.jpeg,.pdf"
									maxSize={5}
									validTypes={["image/png", "image/jpeg", "application/pdf"]}
									required
								/>
							</div>
						</div>

						<div className="flex justify-start mt-4">
							<Button
								type="button"
								onClick={() => {
									const formValues = form.getValues();
									console.log("Submitting full form data...");
									console.log({ ...formValues, payees });
									alert("Form submitted! Check console for details.");
								}}
								className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm"
							>
								Submit
							</Button>
						</div>
					</div>
				) : null}
			</form>
		</Form>
	);
}
