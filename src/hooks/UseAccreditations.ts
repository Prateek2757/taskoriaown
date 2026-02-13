import useSWR from "swr";
import axios from "axios";

export interface Accreditation {
  id: string;
  user_id: number;
  name: string;
  issuing_organization: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface AccreditationsResponse {
  accreditations: Accreditation[];
}

interface AccreditationResponse {
  accreditation: Accreditation;
}

const fetcher = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

export function useAccreditations() {
  const { data, error, isLoading, mutate } = useSWR<AccreditationsResponse>(
    "/api/profile/accreditations",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const createAccreditation = async (accreditationData: {
    name: string;
    issuing_organization: string;
  }) => {
    try {
      const response = await axios.post<AccreditationResponse>(
        "/api/profile/accreditations",
        accreditationData
      );

      await mutate(
        (current) => ({
          accreditations: [...(current?.accreditations || []), response.data.accreditation],
        }),
        { revalidate: false }
      );

      return response.data.accreditation;
    } catch (error) {
      console.error("Error creating accreditation:", error);
      throw error;
    }
  };

  const updateAccreditation = async (
    id: string,
    accreditationData: {
      name: string;
      issuing_organization: string;
    }
  ) => {
    try {
      const response = await axios.patch<AccreditationResponse>(
        `/api/profile/accreditations/${id}`,
        accreditationData
      );

      await mutate(
        (current) => ({
          accreditations: current?.accreditations.map((acc) =>
            acc.id === id ? response.data.accreditation : acc
          ) || [],
        }),
        { revalidate: false }
      );

      return response.data.accreditation;
    } catch (error) {
      console.error("Error updating accreditation:", error);
      throw error;
    }
  };

  const deleteAccreditation = async (id: string) => {
    try {
      await axios.delete(`/api/profile/accreditations/${id}`);

      await mutate(
        (current) => ({
          accreditations: current?.accreditations.filter((acc) => acc.id !== id) || [],
        }),
        { revalidate: false }
      );

      return true;
    } catch (error) {
      console.error("Error deleting accreditation:", error);
      throw error;
    }
  };

  const reorderAccreditations = async (
    accreditationOrders: Array<{ id: string; display_order: number }>
  ) => {
    try {
      const response = await axios.put<AccreditationsResponse>(
        "/api/profile/accreditations",
        { accreditationOrders }
      );

      // Update the cache with the new order
      await mutate(response.data, { revalidate: false });

      return response.data.accreditations;
    } catch (error) {
      console.error("Error reordering accreditations:", error);
      throw error;
    }
  };

  return {
    accreditations: data?.accreditations || [],
    isLoading,
    isError: error,
    createAccreditation,
    updateAccreditation,
    deleteAccreditation,
    reorderAccreditations,
    mutate,
  };
}