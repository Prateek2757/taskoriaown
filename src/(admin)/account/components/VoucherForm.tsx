"use client";
import FormInput from "@/components/formElements/FormInput";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { use, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
	initialVoucherData,
	AddVoucherSchema,
	VoucherSchemaDTO,
} from "../Schema/VoucherSchema";
import FormSelect from "@/components/formElements/FormSelect";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import FormInputFile from "@/components/formElements/FormInputFile";
import VouterFormTable from "./VouterFormTable";
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiGetCall, apiPostCall, PostCallData } from "@/helper/apiService";
import { Button } from "@/components/ui/button";
import Usevalidation from "@/hooks/Admin/use-validation";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { useRouter } from "next/navigation";

const VoucherForm = ({ data }: { data?: VoucherSchemaDTO | undefined }) => {
	const [VouterRequiredDetails, setVouterRequiredDetails] =
		React.useState<any>();

    
	useEffect(() => {
		if (data) {
      
			form.reset(data);
      form.setValue("voucherCode", data.voucherCode || "");
      form.setValue("transactionDate", data.transactionDate || "");
      form.setValue("narration", data.narration || "");
      form.setValue("voucherCode", data.voucherCode || "");
		}
	}, [data]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = {
					endpoint: "voucher_required_list",
				};
				const response = await apiPostCall(data as PostCallData);
				if (response?.data && response.status === API_CONSTANTS.success) {
					console.log(
						"Ledger Required Details is in this response:",
						response.data,
					);
					setVouterRequiredDetails(response.data);
				} else {
					console.error("Invalid response format or failed API call");
				}
			} catch (error) {
				console.error("Error fetching  data:", error);
			} finally {
			}
		};
		fetchData();
	}, []);
	const form = useForm<VoucherSchemaDTO>({
		resolver: zodResolver(AddVoucherSchema),
		mode: "onChange",
		defaultValues: initialVoucherData,
	});
	const { showToast } = useToast();
	const route = useRouter();
	const onSubmit: SubmitHandler<VoucherSchemaDTO> = async (
		formData: VoucherSchemaDTO,
	) => {
		console.log("Form data being submitted:", formData);

		try {
			// Check if this is an UPDATE (voucherNumber or tempVoucherNumber is present)
			const isUpdate = Boolean(
				formData.voucherNumber || formData.tempVoucherNumber,
			);

			const submitData: PostCallData & {
				userName?: string | undefined | null;
			} = {
				...formData,
				endpoint: isUpdate ? "voucher_update" : "voucher_add",
			};

			console.log("Final submitData:", submitData);

			const response = await apiPostCall(submitData);

			console.log("API response:", response.data);

			if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
				showToast(
					response.data.code,
					response.data.message,
					isUpdate
						? "Voucher Updated Successfully"
						: "Voucher Added Successfully",
				);
				route.push(`/account/voucher/voucher`);
			} else {
				showToast(
					response?.data.code,
					response?.data.message,
					isUpdate ? "Voucher Update Failed" : "Voucher Addition Failed",
				);
			}
		} catch (error) {
			console.log("Error submitting voucher form:", error);
		} finally {
			console.log("Voucher process completed");
		}
	};

	const { onInvalid, validationErrors } = Usevalidation();
	return (
		<div className="my-4">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
					<div className="bg-white rounded-lg border mb-6 mt-4">
						<div className="p-6 space-y-8">
							<div className="border-0 md:border border-dashed border-gray-400 rounded-lg  p-0 md:p-6 md:pb-0">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
									<div className="space-y-2">
										<FormSelect
											name="voucherCode"
											options={VouterRequiredDetails?.voucherTypeList || []}
											label="Voucher Type"
											caption="Select Voucher Type"
											form={form}
											required={true}
										/>
									</div>
									<DateConverter
										form={form}
										name="transactionDate"
										labelNep="Transition Date (BS)"
										labelEng="Transition Date (AD)"
									/>
									<FormInputFile
										name="voucherFile"
										label="Docs"
										form={form}
										fileNameField="voucherFileName"
										accept=".png,.jpg,.jpeg,.pdf"
										maxSize={5}
										validTypes={["image/png", "image/jpeg", "application/pdf"]}
										{...(data?.voucherFile && {
										  editMode: true,
										  initialImageUrl: `${data.voucherFile}`,
										  initialFileName: `${data.docPath}`,
										})}
										required={true}
									/>
									<div className="space-y-2">
										<FormInput
											name="narration"
											label="Narration"
											form={form}
											required={true}
											type={"text"}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<VouterFormTable
						form={form}
						data={data?.getLegerDetails}
						partialPayments={VouterRequiredDetails}
					/>
					<Button
						type="submit"
						className="bg-blue-600 hover:bg-blue-700 float-start text-white shadow-sm transition-colors duration-200 flex items-center gap-2"
					>
						Submit Voucher
					</Button>
					<div>
						{validationErrors.length > 0 && (
							<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
								<div className="flex">
									<div className="flex-shrink-0">
										<svg
											className="h-5 w-5 text-red-400"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<title>Title</title>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<div className="ml-3">
										<h3 className="text-sm font-medium text-red-800">
											Please fix the following errors:
										</h3>
										<ul className="mt-2 text-sm text-red-700 list-disc list-inside">
											{validationErrors.map((error, index) => (
												<li key={`${index * 1}-errors`}>{error}</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						)}
					</div>
				</form>
			</Form>
		</div>
	);
};

export default VoucherForm;
