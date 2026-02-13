import useSWR from "swr";
import axios from "axios";

export interface Photo {
  id: string;
  user_id: number;
  photo_url: string;
  title: string | null;
  description: string | null;
  display_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

interface PhotosResponse {
  photos: Photo[];
}

interface PhotoResponse {
  photo: Photo;
}

const fetcher = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

export function useProfilePhotos() {
  const { data, error, isLoading, mutate } = useSWR<PhotosResponse>(
    "/api/profile/photo_setting",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const createPhoto = async (
    photo_url: string, 
    title?: string, 
    description?: string,
    is_featured?: boolean
  ) => {
    try {
      const response = await axios.post<PhotoResponse>("/api/profile/photo_setting", {
        photo_url,
        title,
        description,
        is_featured,
      });

      await mutate(
        (current) => ({
          photos: [...(current?.photos || []), response.data.photo],
        }),
        { revalidate: false }
      );

      return response.data.photo;
    } catch (error) {
      console.error("Error creating photo:", error);
      throw error;
    }
  };

  const updatePhoto = async (
    id: string, 
    title?: string, 
    description?: string,
    is_featured?: boolean
  ) => {
    try {
      const response = await axios.patch<PhotoResponse>(
        `/api/profile/photo_update_delete/${id}`,
        { title, description, is_featured }
      );

      await mutate(
        (current) => ({
          photos: current?.photos.map((p) =>
            p.id === id ? response.data.photo : p
          ) || [],
        }),
        { revalidate: false }
      );

      return response.data.photo;
    } catch (error) {
      console.error("Error updating photo:", error);
      throw error;
    }
  };

  const deletePhoto = async (id: string) => {
    try {
      await axios.delete(`/api/profile/photo_update_delete/${id}`);

      await mutate(
        (current) => ({
          photos: current?.photos.filter((p) => p.id !== id) || [],
        }),
        { revalidate: false }
      );

      return true;
    } catch (error) {
      console.error("Error deleting photo:", error);
      throw error;
    }
  };

  const reorderPhotos = async (photoOrders: Array<{ id: string; display_order: number }>) => {
    try {
      const response = await axios.put<PhotosResponse>("/api/profile/photos", {
        photoOrders,
      });

      await mutate(response.data, { revalidate: false });

      return response.data.photos;
    } catch (error) {
      console.error("Error reordering photos:", error);
      throw error;
    }
  };

  return {
    photos: data?.photos || [],
    isLoading,
    isError: error,
    createPhoto,
    updatePhoto,
    deletePhoto,
    reorderPhotos,
    mutate,
  };
}