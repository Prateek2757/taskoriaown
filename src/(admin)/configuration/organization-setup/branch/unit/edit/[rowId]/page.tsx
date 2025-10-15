'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { API_CONSTANTS } from '@/constants/staticConstant';
import { apiPostCall, type PostCallData } from '@/helper/apiService';
import { AddEditBranchDTO } from '../../schemas/branchSchemas';
import BranchForm from '../../../components/BranchForm';


export default function Page() {
    const [branchData, setBranchData] = useState<AddEditBranchDTO>();

    const params = useParams();
    useEffect(() => {
        const rowId = params.rowId;
        const fetchData = async () => {
            try {
                const data = {
                    rowId: rowId || null,
                    endpoint: 'branch_detail',
                };
                console.log('this is form response', data);
                const response = await apiPostCall(data as PostCallData);
                console.log('this is form response', response);
                if (
                    response?.data &&
                    response.status === API_CONSTANTS.success
                ) {
                    setBranchData(response.data);
                } else {
                    console.error('Invalid response format or failed API call');
                }
            } catch (error) {
                console.error('Error fetching Kyc Detail data:', error);
            } finally {
            }
        };
        if (rowId) {
            fetchData();
        }
    }, [params.rowId]);
    return <BranchForm data={branchData} />;
}
