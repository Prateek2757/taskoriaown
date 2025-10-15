import { useRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { AddEditKycDTO } from "@/app/(admin)/kyc/schemas/kycSchema";
import { useOnlyAlphabets, useOnlyNumbers } from "@/hooks/useInputValidation";
import FormInput from "@/components/formElements/FormInput";
import FormSelect from "@/components/formElements/FormSelect";

type GeneralDetailsProps = {
	kycRequiredFields?: KycRequiredFields;
	form: UseFormReturn<AddEditKycDTO>;
	setClientVerification: (value: boolean) => void;
	setMobileVerification: (value: boolean) => void;
	futureData: boolean;
};

export default function ExtraDetails({
	kycRequiredFields,
	form,
}: GeneralDetailsProps) {
	const DEBOUNCE_DELAY = 500;
	const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const dateOfBirth = form.watch("dateOfBirth");
	const firstName = form.watch("firstName");
	const lastName = form.watch("lastName");
	const age = form.watch("age");
	const fatherName = form.watch("fatherName");
	const gender = form.watch("gender");
	const permanentDistrict = form.watch("permanentDistrict");
	const mobileNumber = form.watch("mobileNumber");

	return (
		<>
			<div className="bg-white rounded-lg border mb-6 mt-4 justify-start">
				<div className="p-6">
					<h2 className="text-xl font-bold text-gray-800 mb-6">
						Extra and Discounts
					</h2>

					<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
							{/* {!kycNumberData && ( */}

							<div className="space-y-2">
								<FormInput
									form={form}
									name="saOccupationExtraRate"
									type="text"
									placeholder="Enter SA Occupation Extra Rate"
									label="SA Occupation Extra Rate"
									required={true}
									onKeyDown={useOnlyNumbers()}
								/>
							</div>

							<div className="space-y-2">
								<FormInput
									form={form}
									name="saHealthExtraRate"
									type="text"
									placeholder="Enter SA Health Extra Rate"
									label="SA Health Extra Rate"
									required={true}
									onKeyDown={useOnlyNumbers()}
								/>
							</div>
							<div className="space-y-2">
								<FormInput
									form={form}
									name="nonStandardExtraRate"
									type="text"
									placeholder="Enter Non Standard Extra Rate"
									label="Non Standard Extra Rate"
									required={true}
									onKeyDown={useOnlyNumbers()}
								/>
							</div>
							<div className="space-y-2">
								<FormInput
									form={form}
									name="extra discount rate"
									type="text"
									placeholder="Enter Extra Discount Rate"
									label="Extra Discount Rate"
									onKeyDown={useOnlyNumbers()}
								/>
							</div>
						</div>
					</div>

					{/* )} */}
				</div>
			</div>
		</>
	);
}
