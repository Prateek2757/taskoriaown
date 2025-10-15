import React from "react";
import type { UseFormReturn } from "react-hook-form";
import type { AddEditOnlineProposalDTO } from "@/app/(admin)/online-proposal/onlineProposalSchema";
import FormInput from "@/components/formElements/FormInput";
import { FormSwitch } from "@/components/formElements/FormSwitch";

type JournalProps = {
	form: UseFormReturn<AddEditOnlineProposalDTO>;
};

export default function Journal({ form }: JournalProps) {
	return (
		<>
			<section className="border border-gray-200 rounded-lg p-6 mb-3 bg-white">
				<h2 className="text-xl font-bold text-gray-800 mb-6">Journal</h2>
				<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<FormInput
							form={form}
							type="number"
							name="minVoucherAmount"
							label="Min. Voucher Amount"
						/>
						<FormInput
							form={form}
							type="number"
							name="maxVoucherAmount"
							label="Max. Voucher Amount"
						/>
						<div className="flex items-center ">
							<FormSwitch label="Is Active" name="isActive" form={form} />
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
