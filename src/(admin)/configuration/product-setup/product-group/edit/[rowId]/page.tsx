"use client";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductGroupForm } from "../../components/ProductGroupForm";
import { AddProductGroupDTO } from "../../ProductGroupSchema";

export default function Page() {
  const [productGroupData, setProductGroupData] =
    useState<AddProductGroupDTO>();

  const params = useParams();
  useEffect(() => {
    const productRowId = params.rowId;
    const fetchData = async () => {
      try {
        const data = {
          rowId: productRowId,
          endpoint: "productgroup_detail",
        };
        const response = await apiPostCall(data as PostCallData);
        console.log("this is form response", response);
        if (response?.data && response.status === API_CONSTANTS.success) {
          setProductGroupData(response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching Product Detail data:", error);
      } finally {
      }
    };
    if (productRowId) {
      fetchData();
    }
  }, [params.rowId]);

  return <ProductGroupForm data={productGroupData} />;
}
