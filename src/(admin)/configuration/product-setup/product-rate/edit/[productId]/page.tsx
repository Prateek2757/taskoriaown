'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { API_CONSTANTS } from '@/constants/staticConstant';
import { apiPostCall, type PostCallData } from '@/helper/apiService';
import { ProductRateForm } from '../../components/ProductRateForm';
import { ProductRateDTO } from '../../ProductRateSchema';

export default function Page() {
    const [productRateData, setProductRateData] = useState<ProductRateDTO>();

    const params = useParams();
    useEffect(() => {
        const productId = params.productId;
        const fetchData = async () => {
            try {
                const data = {
                    productId: productId || null,
                    endpoint: 'product_detail',
                };
                const response = await apiPostCall(data as PostCallData);
                console.log('this is form response', response);
                if (
                    response?.data &&
                    response.status === API_CONSTANTS.success
                ) {
                    setProductRateData(response.data);
                } else {
                    console.error('Invalid response format or failed API call');
                }
            } catch (error) {
                console.error('Error fetching Product Detail data:', error);
            } finally {
            }
        };
        if (productId) {
            fetchData();
        }
    }, [params.productId]);
    return <ProductRateForm data={productRateData} />;
}
