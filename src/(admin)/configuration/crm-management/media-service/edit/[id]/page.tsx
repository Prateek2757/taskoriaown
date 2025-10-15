"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import CrmManagementForm from "../../components/CrmManagementForm";
import type { AddEditMediaServiceDTO } from "../../schemas/crmmanagementSchema";

export default function Page() {
  const [mediaData, setMediaData] = useState<AddEditMediaServiceDTO>();
  const params = useParams();

  useEffect(() => {
    const mediaId = params.id; // assuming your route is /edit/[id]

    const fetchData = async () => {
      try {
        const data: PostCallData = {
          mediaIdEncrypted: mediaId || null,
          endpoint: "media_service_detail", // adjust to your API
        };
        const response = await apiPostCall(data);
        console.log("Media Service API response:", response);

        if (response?.data && response.status === API_CONSTANTS.success) {
          setMediaData(response.data);
        } else {
          console.error("Invalid response or failed API call");
        }
      } catch (error) {
        console.error("Error fetching Media Service data:", error);
      }
    };

    if (mediaId) {
      fetchData();
    }
  }, [params.id]);

  return <CrmManagementForm data={mediaData} editMode={true} />;
}
