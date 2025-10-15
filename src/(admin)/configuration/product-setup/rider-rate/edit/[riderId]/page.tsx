'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { API_CONSTANTS } from '@/constants/staticConstant';
import { apiPostCall, type PostCallData } from '@/helper/apiService';
import { RiderRateForm } from '../../components/RiderRateForm';
import { RiderRateDTO } from '../../RiderRateSchema';

export default function Page() {
    const [riderRateData, setRiderRateData] = useState<RiderRateDTO>();

    const params = useParams();
    useEffect(() => {
        const riderId = params.riderId;
        const fetchData = async () => {
            try {
                const data = {
                    riderId: riderId || null,
                    endpoint: 'rider_detail',
                };
                const response = await apiPostCall(data as PostCallData);
                console.log('this is form response', response);
                if (
                    response?.data &&
                    response.status === API_CONSTANTS.success
                ) {
                    setRiderRateData(response.data);
                } else {
                    console.error('Invalid response format or failed API call');
                }
            } catch (error) {
                console.error('Error fetching Rider Criteria Detail data:', error);
            } finally {
            }
        };
        if (riderId) {
            fetchData();
        }
    }, [params.riderId]);
    return <RiderRateForm data={riderRateData} />;
}
