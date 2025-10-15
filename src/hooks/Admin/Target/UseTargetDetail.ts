import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import { useState } from "react";

export const UseTargetDetail = () => {
	const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
	const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
	const { showToast } = useToast();
	const [targetDetail, setTargetDetails] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);

	const getTargetDetails = async () => {
		try {
			setIsLoading(true);
			const submitData: PostCallData & {
				userName?: string | undefined | null;
			} = {
				endpoint: "get_target_details",
			};
			const response = await apiPostCall(submitData);
			console.log("getTargetDetails information is in this log", response.data);
			if (response.data.code === SYSTEM_CONSTANTS.success_code) {
				setTargetDetails(response.data);
			} else {
				showToast(
					response?.data.code,
					response?.data.message,
					response?.data.message,
				);
			}
		} catch (_error) {
			showToast("103", "Something went wrong", "Target Addition Failed");
		} finally {
			setIsLoading(false);
		}
	};
	const handlegetClick = (e: React.MouseEvent) => {
		e.preventDefault();
		getTargetDetails();
		setIsReferralModalOpen(true);
	};
	const handleLeadClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsLeadModalOpen(true);
	};
	return {
		targetDetail,
		isLoading,
		handlegetClick,
		handleLeadClick,
		isReferralModalOpen,
		isLeadModalOpen,
        setIsLeadModalOpen,
        setIsReferralModalOpen
	};
};
