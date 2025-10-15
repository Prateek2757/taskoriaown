"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiGetCall, apiPostCall, type PostCallData } from "@/helper/apiService";
import ApplicationUserForm from "../../components/ApplicationUserForm";
import type { AddApplicationUserDTO } from "../../schemas/ApplicationUserSchemas";

export default function Page() {
  const [userData, setUserData] = useState<AddApplicationUserDTO>();
  const params = useParams();

  useEffect(() => {
    const id = params.id;

    const fetchData = async () => {
      if(!id) return;
      try {
        const data = {
          id: id || null,
          endpoint: "application_user_details",
        };
        console.log("User Detials:",data);
        
        const response = await apiPostCall(data as PostCallData);
        console.log("Response:,", response);
        if (response?.data && response.status === API_CONSTANTS.success) {
          setUserData(response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching user detail:", error);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  return <ApplicationUserForm data={userData} />;
}
