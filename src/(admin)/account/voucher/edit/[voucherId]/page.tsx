"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_CONSTANTS } from "@/constants/staticConstant";
import {
  apiGetCall,
  type PostCallData,
} from "@/helper/apiService";
import { VoucherSchemaDTO } from "../../../Schema/VoucherSchema";
import VoucherForm from "../../../components/VoucherForm";

export default function Page() {
  const [voucherData, setVoucherData] = useState<VoucherSchemaDTO>();

  const params = useParams();
  useEffect(() => {
    const voucherId = params.voucherId;
    const fetchData = async () => {
      try {
        const data = {
          params: {
            id: voucherId,
          },
          endpoint: "voucher_detail",
        };
        const response = await apiGetCall(data as PostCallData);
        console.log("Voucher Detail data response:", response);
        if (response?.data && response.status === API_CONSTANTS.success) {
          setVoucherData(response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching Voucher Detail data:", error);
      } finally {
      }
    };
    if (voucherId) {
      fetchData();
    }
  }, [params.voucherId]);
  return <VoucherForm data={voucherData} />;
}
