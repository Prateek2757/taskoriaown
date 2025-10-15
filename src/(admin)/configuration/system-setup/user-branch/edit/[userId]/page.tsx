"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import RoleForm from "../../components/RoleForm";
import type { AddEditRoleDTO } from "../../schemas/RoleSchemas";
import UserWiseBranchForm from "../../components/UserWiseBranchForm";

export default function Page() {
  const [roleData, setRoleData] = useState<AddEditRoleDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    const roleId = params.id;

    const fetchData = async () => {
      if (!roleId) return;

      setLoading(true);
      setError(null);

      try {
        const data = {
          id: roleId,
          endpoint: "role_details",
        };

        console.log("Fetching role data with:", data);

        const response = await apiPostCall(data as PostCallData);
        console.log("API Response:", response);

        if (
          response?.data &&
          (response.status === API_CONSTANTS.success ||
            response.data.code === SYSTEM_CONSTANTS.success_code)
        ) {
          const roleDetails = response.data.data || response.data;
          console.log("Setting role data:", roleDetails);
          setRoleData(roleDetails);
        } else {
          console.error(
            "Invalid response format or failed API call:",
            response
          );
          setError("Failed to fetch role details");
        }
      } catch (error) {
        console.error("Error fetching role detail:", error);
        setError("Error fetching role details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading role details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return <UserWiseBranchForm data={roleData || undefined} />;
}
