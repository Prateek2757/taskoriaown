import { emptyViewLead, type ViewLeadDTO, ViewLeadSchema } from '@/app/(admin)/lead/leadSchema';
import { useToast } from '@/components/uiComponents/custom-toast/custom-toast';
import { SYSTEM_CONSTANTS } from '@/constants/staticConstant';
import { apiPostCall, type PostCallData } from '@/helper/apiService';
import { zodResolver } from '@hookform/resolvers/zod';
import type React from 'react'
import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form';

export const UseGetLead = () => {
    const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
	const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
	const { showToast } = useToast();
	const [targetDetail, setTargetDetails] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);
	const getLeadDetails = async () => {
		const formData = {
			Status: "Agent",
			FromDate: new Date().toISOString().split("T")[0],
			ToDate: new Date().toISOString().split("T")[0],
		};
		console.log("this is the form data", formData);

		try {
			setIsLoading(true);
			const submitData: PostCallData & {
				userName?: string | undefined | null;
			} = {
				...formData,
				endpoint: "lead_view_data",
			};
			const response = await apiPostCall(submitData);
			const { data } = response; // Real data

			console.log(
				"getLeadDetails information is in this log in in the log of the data",
				data.derReportList,
			);
			if (response.data.code === SYSTEM_CONSTANTS.success_code) {
				setTargetDetails(data.derReportList);
			} else {
				showToast(
					response?.data.code,
					response?.data.message,
					"Target Addition Failed",
				);
			}
		} catch (_error) {
			showToast("103", "Something went wrong", "Target Addition Failed");
		} finally {
			setIsLoading(false);
		}
	};
    const onSubmitConditionData: SubmitHandler<any> = async (formData: any) => {
		setIsLoading(true);
		try {
			const submitData: PostCallData & {
				userName?: string | undefined | null;
			} = {
				...formData,
				Status: "Agent",
				endpoint: "lead_view_data",
			};
			const response = await apiPostCall(submitData);
			const { data } = response; // Real data

			console.log(
				"getLeadDetails information is in this log in in the log of the data",
				data.derReportList,
			);
			if (response.data.code === SYSTEM_CONSTANTS.success_code) {
				setTargetDetails(data.derReportList);
			} else {
				showToast(
					response?.data.code,
					response?.data.message,
					"Target Addition Failed",
				);
			}
		} catch (_error) {
			showToast("103", "Something went wrong", "Target Addition Failed");
		}finally{
			setIsLoading(false);
		}
	};

	const handlegetClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsReferralModalOpen(true);
		getLeadDetails();
	};
	const handleLeadClick = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsLeadModalOpen(true);
	};
    const form = useForm<ViewLeadDTO>({
		resolver: zodResolver(ViewLeadSchema),
		defaultValues: emptyViewLead,
	});

	
  return {
    isReferralModalOpen,
    isLeadModalOpen,
    targetDetail,
    isLoading,
    handlegetClick,
    handleLeadClick,
    setIsReferralModalOpen,
    setIsLeadModalOpen,
    setTargetDetails,
    onSubmitConditionData,
    form
  };
}
