'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { API_CONSTANTS } from '@/constants/staticConstant';
import { apiPostCall, type PostCallData } from '@/helper/apiService';
import TemplateForm from '../../components/TemplateForm';
import { AddEditTemplateDTO } from '../../schemas/templateSchemas';

export default function Page() {
    const [kycData, setKycData] = useState<AddEditTemplateDTO>();

    const params = useParams();
    useEffect(() => {
        const kycNumber = params.kycNumber;
        const fetchData = async () => {
            try {
                const data = {
                    KYCNumberEncrypted: kycNumber || null,
                    endpoint: 'kyc_detail',
                };
                const response = await apiPostCall(data as PostCallData);
                console.log('this is form response', response);
                if (
                    response?.data &&
                    response.status === API_CONSTANTS.success
                ) {
                    setKycData(response.data);
                } else {
                    console.error('Invalid response format or failed API call');
                }
            } catch (error) {
                console.error('Error fetching Kyc Detail data:', error);
            } finally {
            }
        };
        if (kycNumber) {
            fetchData();
        }
    }, [params.kycNumber]);
    return <TemplateForm data={kycData} />;
}
