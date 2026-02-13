import useSWR from "swr";
import axios from "axios";

export interface SocialLink {
  id: string;
  user_id: number;
  platform: string;
  url: string;
  username: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

interface SocialLinksResponse {
  socialLinks: SocialLink[];
}

interface SocialLinkResponse {
  socialLink: SocialLink;
}

const fetcher = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

export function useSocialLinks() {
  const { data, error, isLoading, mutate } = useSWR<SocialLinksResponse>(
    "/api/profile/social_links",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const createSocialLink = async (
    platform: string,
    url: string,
    username?: string,
    is_visible?: boolean
  ) => {
    try {
      const response = await axios.post<SocialLinkResponse>(
        "/api/profile/social_links",
        {
          platform,
          url,
          username,
          is_visible,
        }
      );

      await mutate(
        (current) => ({
          socialLinks: [...(current?.socialLinks || []), response.data.socialLink],
        }),
        { revalidate: false }
      );

      return response.data.socialLink;
    } catch (error) {
      console.error("Error creating social link:", error);
      throw error;
    }
  };

  const updateSocialLink = async (
    id: string,
    url: string,
    username?: string,
    is_visible?: boolean
  ) => {
    try {
      const response = await axios.patch<SocialLinkResponse>(
        `/api/profile/social_link/${id}`,
        { url, username, is_visible }
      );

      await mutate(
        (current) => ({
          socialLinks: current?.socialLinks.map((link) =>
            link.id === id ? response.data.socialLink : link
          ) || [],
        }),
        { revalidate: false }
      );

      return response.data.socialLink;
    } catch (error) {
      console.error("Error updating social link:", error);
      throw error;
    }
  };

  const deleteSocialLink = async (id: string) => {
    try {
      await axios.delete(`/api/profile/social_link/${id}`);

      await mutate(
        (current) => ({
          socialLinks: current?.socialLinks.filter((link) => link.id !== id) || [],
        }),
        { revalidate: false }
      );

      return true;
    } catch (error) {
      console.error("Error deleting social link:", error);
      throw error;
    }
  };

  const reorderSocialLinks = async (linkOrders: Array<{ id: string; display_order: number }>) => {
    try {
      const response = await axios.put<SocialLinksResponse>("/api/profile/social_links", {
        linkOrders,
      });

      await mutate(response.data, { revalidate: false });

      return response.data.socialLinks;
    } catch (error) {
      console.error("Error reordering social links:", error);
      throw error;
    }
  };

  return {
    socialLinks: data?.socialLinks || [],
    isLoading,
    isError: error,
    createSocialLink,
    updateSocialLink,
    deleteSocialLink,
    reorderSocialLinks,
    mutate,
  };
}