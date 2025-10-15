"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import ManageEquivalentCashFrom from "../../manage-equivalent-cash/ManageEquivalentCashFrom";
import { AddSchemeDTO } from "../../schemas/addSchemeSchema";

export default function Page() {
  const [kycData, setKycData] = useState<AddSchemeDTO>(); 

  const params = useParams();

  useEffect(() => {
    const schemaName = params.schemaName;

    const fetchData = async () => {
      try {
        const data = {
          schemaNameEncrypted: schemaName || null,
          endpoint: "kyc_detail",
        };
        const response = await apiPostCall(data as PostCallData);
        console.log("this is form response", response);

        if (response?.data && response.status === API_CONSTANTS.success) {
          const mappedData: AddSchemeDTO = {
            fiscalYear: response.data.fiscalYear || "",
            schemeName: response.data.schemeName || "",
            schemeFor: response.data.schemeFor || "",
            month: response.data.month || "",
          };

          setKycData(mappedData);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching Kyc Detail data:", error);
      }
    };

    if (schemaName) {
      fetchData();
    }
  }, [params.schemaName]);

  return (
    <>
      {kycData ? (
        <ManageEquivalentCashFrom
          initialValues={kycData} 
          onSubmit={(data) => {
            alert(" Scheme updated successfully!");
            console.log("Updated Data:", data);
          }}
        />
      ) : (
        <div className="p-4 text-gray-500">Loading...</div>
      )}
    </>
  );
}
