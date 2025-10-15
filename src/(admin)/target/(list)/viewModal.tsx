'use client'
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

interface ReferralModalProps {
    isOpen: boolean;
    onClose: () => void;
	targetDetail?:any;	
	isLoading?:boolean;
}
function ViewModal({ isOpen, onClose,targetDetail,isLoading }: ReferralModalProps) {
	
	return (
		<Sheet open={isOpen} onOpenChange={onClose}>
			<SheetContent className="!w-full sm:!max-w-[600px] gap-1">
				<SheetHeader className="sticky top-0 border-b">
					<SheetTitle>Target Detail</SheetTitle>
				</SheetHeader>
				<div className="overflow-y-auto px-4 py-2 flex-1">
					<h2 className="text-gray-700 text-md">
						Date:
						<b className="ml-1">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</b>
					</h2>
					<Separator className="my-3" />
					{isLoading ? (
						<div className="flex items-center justify-center p-8">
							<div className="text-center">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
								<p className="text-sm text-gray-600">
									Loading target details...
								</p>
							</div>
						</div>
					) : (
						<>
						<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
						Branch Code:
						<span className="">
							<b>Corporate Office</b>
						</span>
					</div>

					<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
						No. of New Agent:
						<span className=" text-green-600">
							<b>{targetDetail?.noOfNewAgentAchievement??'0'}</b>
						</span>
					</div>

					<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
						FPI Policy Count:
						<span className=" text-green-600">
							<b>{targetDetail?.fpiPolicyCountAchievement??'0'}</b>
						</span>
					</div>

					<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
						FPI Premium:
						<span className=" text-green-600">
							<b>₹ {targetDetail?.fpiPreimumAchievement??'0'}</b>
						</span>
					</div>

					<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
						Term Policy Count:
						<span className=" text-red-600">
							<b>{targetDetail?.termPolicyCountAchievement??'0'}</b>
						</span>
					</div>

					<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
						Term Premium:
						<span className=" text-red-600">
							<b>₹ {targetDetail?.termPreimumAchievement??'0'}</b>
						</span>
					</div>

					<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
						Term Policy Count (Individual):
						<span className=" text-red-600">
							<b>{targetDetail?.termPolicyCountIndividualAchievement??'0'}</b>
						</span>
					</div>

					<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
						Term Premium (Individual):
						<span className=" text-red-600">
							<b>₹ {targetDetail?.termPreimumIndividualAchievement??'0'}</b>
						</span>
					</div>

					<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
						RPI Policy Count:
						<span className=" text-green-600">
							<b>{targetDetail?.rpiPolicyCountAchievement??'0'}</b>
						</span>
					</div>

					<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
						RPI Business:
						<span className=" text-green-600">
							<b>₹ {targetDetail?.rpiPreimumAchievement??'0'}</b>
						</span>
					</div>

					<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
						No of AM Creation:
						<span className=" text-red-600">
							<b>{targetDetail?.noOfAMCreationAchievement??'0'}</b>
						</span>
					</div>

					<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
						No of Club Achiever:
						<span className=" text-red-600">
							<b>{targetDetail?.noOfClubAchieverAchievement??'0'}</b>
						</span>
					</div>

					<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
						MOU with Co-Operatives:
						<span className=" text-red-600">
							<b>{targetDetail?.mouWithCooperativesAchievement??'0'}</b>
						</span>
					</div>

					<div className="flex items-center justify-between text-gray-700 text-sm mb-2">
						Remarks:
						<span className="">
							<b>{targetDetail?.remarks??'No remarks found'}</b>
						</span>
					</div>
					</>
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

export default ViewModal;


