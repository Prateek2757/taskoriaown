'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { API_CONSTANTS } from '@/constants/staticConstant';
import { apiPostCall, type PostCallData } from '@/helper/apiService';
import { RiskForm } from '../../components/RiskForm';
import { RiskDTO } from '../../RiskSchema';

export default function Page() {
    const [riskData, setRiskData] = useState<RiskDTO>();

    const params = useParams();
    useEffect(() => {
        const policyNo = params.policyNo;
        const fetchData = async () => {
            try {
                const data = {
                    policyNo: policyNo || null,
                    endpoint: 'policy_detail',
                };
                const response = await apiPostCall(data as PostCallData);
                console.log('this is form response', response);
                if (
                    response?.data &&
                    response.status === API_CONSTANTS.success
                ) {
                    setRiskData(response.data);
                } else {
                    console.error('Invalid response format or failed API call');
                }
            } catch (error) {
                console.error('Error fetching Risk Detail data:', error);
            } finally {
            }
        };
        if (policyNo) {
            fetchData();
        }
    }, [params.policyNo]);
    return <RiskForm data={riskData} />;
}
