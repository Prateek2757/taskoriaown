"use client";
import FormInputDate from "@/components/formElements/FormInputDate";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { UseGetLead } from "@/hooks/Admin/Lead/UseGetLead";
import { Search } from "lucide-react";
interface ReferralModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function ViewModal({
	isOpen,
	onClose,
}: ReferralModalProps) {
	const { form, onSubmitConditionData, targetDetail, isLoading } = UseGetLead();

	return (
		<Sheet open={isOpen} onOpenChange={onClose}>
			<SheetContent className="!w-full sm:!max-w-[600px] gap-1">
				<SheetHeader className="sticky top-0 border-b">
					<SheetTitle>Lead Detail</SheetTitle>
				</SheetHeader>
				<div className="overflow-y-auto px-4 py-2 flex-1">
					<h2 className="text-gray-700 text-md">
						Date:
						<b className="ml-1">{new Date().toLocaleDateString()}</b>
					</h2>
					<div>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmitConditionData)}
								className="flex items-end	  gap-y-2 mt-6"
							>
								<div className="w-[50%] px-2">
									<FormInputDate
										form={form}
										name="FromDate"
										placeholder="From Date"
										label="From Date"
										required={true}
										futureDate={false}
									/>
								</div>

								<div className="w-[50%] px-2">
									<FormInputDate
										form={form}
										name="ToDate"
										placeholder="To Date"
										label="To Date"
										required={true}
										futureDate={false}
									/>
								</div>
								<Button
									type="submit"
									className="cursor-pointer px-2 text-black flex items-center "
								>
									<Search className="text-white" />
								</Button>
							</form>
						</Form>
					</div>
					{isLoading ? (
						<div className="flex items-center justify-center p-8">
							<div className="text-center">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
								<p className="text-sm text-gray-600">
									Loading lead details...
								</p>
							</div>
						</div>
					) : (
						targetDetail?.map((item: any, index: number) => (
							
							<div
								key={`${item.branchCode}-targetdetail-${index}`}
								className="border-b mt-4 mb-0 border-gray-200 mx-1 bg-gray-100 p-4 pb-2  rounded-md"
							> 
								<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
									Branch Code:
									<span className="">
										<b>{item.branchCode}</b>
									</span>
								</div>

								<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
									Branch Name:
									<span className=" text-green-600">
										<b>{item?.branchName ?? "N/A"}</b>
									</span>
								</div>

								<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
									Name of Prospect:
									<span className=" text-green-600">
										<b>{item?.nameOfProspect ?? "N/A"}</b>
									</span>
								</div>

								<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
									Address:
									<span className=" text-red-600">
										<b>{item?.address ?? "N/A"}</b>
									</span>
								</div>

								<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
									Mobile Number:
									<span className=" text-red-600">
										<b>{item?.mobileNumber ?? "N/A"}</b>
									</span>
								</div>
								<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
									Purpose of Visit:
									<span className=" text-red-600">
										<b>{item?.purposeOfVisit ?? "N/A"}</b>
									</span>
								</div>

								<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
									Duration:
									<span className=" text-red-600">
										<b>{item?.duration ?? "N/A"}</b>
									</span>
								</div>

								<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
									Key Points:
									<span className=" text-green-600">
										<b>{item?.keyPoints ?? "N/A"}</b>
									</span>
								</div>
								<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
									Remarks:
									<span className=" text-green-600">
										<b>{item?.remarks ?? "N/A"}</b>
									</span>
								</div>

								<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
									Date:
									<span className=" text-red-600">
										<b>{item?.date ?? "N/A"}</b>
									</span>
								</div>

								<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
									Next Meeting Date:
									<span className=" text-red-600">
										<b>{item?.nextMeetingDate ?? "N/A"}</b>
									</span>
								</div>
							</div>
						))
					)}
				</div>

				<SheetFooter className="sticky bottom-0 border-t flex-row items-center justify-end">
					<SheetClose asChild>
						<Button variant="outline">Close</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
