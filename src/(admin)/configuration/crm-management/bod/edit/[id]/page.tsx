"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import AddBodList from "../../components/BodListForm";
import type { BodListDTO } from "../../schemas/bodListSchema";

export default function EditBodListPage() {
  const params = useParams();
  const [bodData, setBodData] = useState<BodListDTO>();

  useEffect(() => {
    const bodId = params.id;

    const fetchData = async () => {
      try {
        const requestData: PostCallData = {
          bodIdEncrypted: bodId || null,
          endpoint: "bod_list_detail",
        };

        const response = await apiPostCall(requestData);
        console.log("BOD List API response:", response);

        if (response?.data && response.status === API_CONSTANTS.success) {
          setBodData(response.data);
        } else {
          console.error("Invalid response or failed API call");
        }
      } catch (error) {
        console.error("Error fetching BOD data:", error);
      }
    };

    if (bodId) fetchData();
  }, [params.id]);

  return <AddBodList data={bodData} editMode={true} />;
}
