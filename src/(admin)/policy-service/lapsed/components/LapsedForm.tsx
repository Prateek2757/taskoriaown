"use client";
import { type PostCallData, apiPostCall } from "@/helper/apiService";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { AddEditKycWithFileDTO } from "@/app/(admin)/kyc/schemas/kycSchema";
import RiderDetailTable from "./RiderDetailTable";
import DueInstallments from "./DueInstallments";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type LapsedDTO, lapsedSchema } from "../LapsedSchema";
import { emptyLapsed } from "../LapsedSchema";
import Document from "./Document";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import Link from "next/link";


type Props = {
	data?: LapsedDTO;
};


export const LapsedForm = ({ data }: Props) => {
	const form = useForm<LapsedDTO>({
		defaultValues: data ?? emptyLapsed,
		resolver: zodResolver(lapsedSchema),
	});

	const [kycData, setKycData] = useState<AddEditKycWithFileDTO>();
	const [loading, setLoading] = useState(true);
	const params = useParams();
	const kycNumber = params.kycNumber;

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const data = {
					KYCNumberEncrypted: kycNumber || null,
					endpoint: "kyc_view",
				};
				const response = await apiPostCall(data as PostCallData);
				console.log("this is form response", response);
				if (response?.data && response.status === API_CONSTANTS.success) {
					setKycData(response.data);
				} else {
					console.error("Invalid response format or failed API call");
				}
			} catch (error) {
				console.error("Error fetching Kyc Detail data:", error);
			} finally {
				setLoading(false);
			}
		};
		if (kycNumber) {
			fetchData();
		}
	}, [kycNumber]);

	const displayData = (field: keyof AddEditKycWithFileDTO): string => {
		if (!kycData) return "N/A";
		const value = kycData[field];
		return value?.toString() || "N/A";
	};

	return (
		<div className="p-6">
			<h2 className="text-xl font-bold mb-3">Basic Information</h2>
			<div className="p-0 md:p-6 md:pb-0 border border-dashed border-gray-300 rounded-lg">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm ">
							Policy Holder Name:
							<span className="ml-1">
								<b>{displayData("kycNumber")}</b>
							</span>
						</div>
					</div>
					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Proposal No:
							<span className="ml-1">
								<b>{displayData("branchCode")}</b>
							</span>
						</div>
					</div>
					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							DOC:
							<span className="ml-1">
								<b>{displayData("residenceStatus")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Next Due Date:{" "}
							<span className="ml-1">
								<b>{displayData("nationality")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Product:
							<span className="ml-1">
								<b>{displayData("religion")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							MOP:
							<span className="ml-1">
								<b>{displayData("salutation")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Term:
							<span className="ml-1">
								<b>{displayData("firstName")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Pay Term:
							<span className="ml-1">
								<b>{displayData("firstName")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Sum Assured:
							<span className="ml-1">
								<b>{displayData("firstName")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Basic Premium:
							<span className="ml-1">
								<b>{displayData("firstName")}</b>
							</span>
						</div>
					</div>

					<div className="space-y-2">
						<div className="flex items-center text-gray-700 text-sm">
							Premium:
							<span className="ml-1">
								<b>{displayData("firstName")}</b>
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-5">
				<h2 className="text-xl font-bold mb-3">
					Paid Premium Payment Schedule
				</h2>
				<RiderDetailTable />
				<h2 className="text-xl font-bold mb-3">Due Premium Payment Schedule</h2>
				<DueInstallments />
			</div>
			<Form {...form}>
				<form>
					<Document form={form} isEditMode={true} />
					<div className="flex gap-2 mt-4">
						<Button >
							{/* <Link href={`/proposal/view/${policyNumber}`}> */}
								<FileText className="mr-2" />
								View Underwriting Sheet
							{/* </Link> */}
						</Button>
						<Button>
							Register
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
