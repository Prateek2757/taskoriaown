
import axios from "axios";
import useSWR from "swr";

export interface Service {
  id: string;
  user_id: number;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface ServicesResponse {
  services: Service[];
}

interface ServiceResponse {
  service: Service;
}

const fetcher = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

export function useProfileServices() {
  const { data, error, isLoading, mutate } = useSWR<ServicesResponse>(
    "/api/profile/profile_services_setting",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000, 
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  );

  const createService = async (title: string, description?: string) => {
    try {
      const response = await axios.post<ServiceResponse>("/api/profile/profile_services_setting", {
        title,
        description,
      });

      await mutate(
        (current) => ({
          services: [response.data.service, ...(current?.services || [])],
        }),
        { revalidate: false }
      );

      return response.data.service;
    } catch (error) {
      console.error("Error creating service:", error);
      mutate();
      throw error;
    }
  };

  const updateService = async (id: string, title: string, description?: string) => {
    const currentData = data;
    
    try {
      await mutate(
        (current) => ({
          services: current?.services.map((s) =>
            s.id === id
              ? { ...s, title, description: description || null, updated_at: new Date().toISOString() }
              : s
          ) || [],
        }),
        { revalidate: false }
      );

      const response = await axios.patch<ServiceResponse>(
        `/api/profile/profile_service_setting/${id}`,
        { title, description }
      );

      await mutate(
        (current) => ({
          services: current?.services.map((s) =>
            s.id === id ? response.data.service : s
          ) || [],
        }),
        { revalidate: false }
      );

      return response.data.service;
    } catch (error) {
      console.error("Error updating service:", error);
      await mutate(currentData, { revalidate: false });
      throw error;
    }
  };

  const deleteService = async (id: string) => {
    const currentData = data;
    
    try {
      await mutate(
        (current) => ({
          services: current?.services.filter((s) => s.id !== id) || [],
        }),
        { revalidate: false }
      );

      await axios.delete(`/api/profile/profile_service_setting/${id}`);

      return true;
    } catch (error) {
      console.error("Error deleting service:", error);
      await mutate(currentData, { revalidate: false });
      throw error;
    }
  };

  const bulkUpdateServices = async (services: Array<{ title: string; description?: string }>) => {
    const currentData = data;
    
    try {
      const response = await axios.put<ServicesResponse>("/api/profile/profile_services_setting", {
        services,
      });

      await mutate(response.data, { revalidate: false });

      return response.data.services;
    } catch (error) {
      console.error("Error bulk updating services:", error);
      await mutate(currentData, { revalidate: false });
      throw error;
    }
  };

  const refresh = () => {
    return mutate();
  };

  return {
    services: data?.services || [],
    isLoading,
    isError: !!error,
    error,
    createService,
    updateService,
    deleteService,
    bulkUpdateServices,
    refresh,
    mutate,
  };
}