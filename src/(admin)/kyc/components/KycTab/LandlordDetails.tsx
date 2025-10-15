import type { AddEditKycDTO } from "@/app/(admin)/kyc/schemas/kycSchema";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import FormInput from "../../../../../components/formElements/FormInput";
import { useOnlyAlphabets, useOnlyNumbers } from "@/hooks/useInputValidation";

type LandlordDetailsProps = {
	form: UseFormReturn<AddEditKycDTO>;
	// onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export default function LandlordDetails({ form }: LandlordDetailsProps) {
	const [residenceOwn, setResidencceOwn] = useState(false);
	const residenceStatus = form.watch("residenceStatus");
	useEffect(() => {
		if (residenceStatus === "OWN_RS") {
			setResidencceOwn(true);
			form.setValue("landLordName", " ");
			form.setValue("landLordAddress", " ");
			form.setValue("landLordContactNumber", " ");
		}
	}, [residenceStatus]);

	return (
		<>
			<h2 className="text-xl font-bold text-gray-800 mb-6">
				Information of Landlord
			</h2>

			<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="space-y-2">
						<FormInput
							disabled={residenceOwn}
							form={form}
							name="landLordName"
							type="text"
							placeholder="Enter landLord's name"
							label="Landlord's Name"
							onKeyDown={useOnlyAlphabets()}
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							disabled={residenceOwn}
							form={form}
							name="landLordAddress"
							type="text"
							placeholder="Enter landLord's address"
							label="Landlord's Address"
						/>
					</div>

					<div className="space-y-2">
						<FormInput
							disabled={residenceOwn}
							form={form}
							name="landLordContactNumber"
							type="text"
							placeholder="Enter landLord's contact number"
							label="Landlord's Contact No."
							maxLength={10}
							onKeyDown={useOnlyNumbers()}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
