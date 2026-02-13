import useSWR from "swr";
import axios from "axios";

export interface FAQ {
  presetId?: string; 
  id: string;
  user_id: number;
  question: string;
  answer: string;
  category: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

interface FAQsResponse {
  faqs: FAQ[];
}

interface FAQResponse {
  faq: FAQ;
}

const fetcher = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

export function useFAQs() {
  const { data, error, isLoading, mutate } = useSWR<FAQsResponse>(
    "/api/profile/faqs",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const createFAQ = async (faqData: {
    question: string;
    answer: string;
    category?: string;
    is_visible?: boolean;
    presetId?: string; 
  }) => {
    try {
      const response = await axios.post<FAQResponse>(
        "/api/profile/faqs",
        faqData
      );

      await mutate(
        (current) => ({
          faqs: [...(current?.faqs || []), response.data.faq],
        }),
        { revalidate: false }
      );

      return response.data.faq;
    } catch (error) {
      console.error("Error creating FAQ:", error);
      throw error;
    }
  };

  const updateFAQ = async (
    id: string,
    faqData: {
      question: string;
      answer: string;
      category?: string;
      is_visible?: boolean;
    }
  ) => {
    try {
      const response = await axios.patch<FAQResponse>(
        `/api/profile/faqs/${id}`,
        faqData
      );

      await mutate(
        (current) => ({
          faqs: current?.faqs.map((faq) =>
            faq.id === id ? response.data.faq : faq
          ) || [],
        }),
        { revalidate: false }
      );

      return response.data.faq;
    } catch (error) {
      console.error("Error updating FAQ:", error);
      throw error;
    }
  };

  const deleteFAQ = async (id: string) => {
    try {
      await axios.delete(`/api/profile/faqs/${id}`);

      await mutate(
        (current) => ({
          faqs: current?.faqs.filter((faq) => faq.id !== id) || [],
        }),
        { revalidate: false }
      );

      return true;
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      throw error;
    }
  };

  const reorderFAQs = async (
    faqOrders: Array<{ id: string; display_order: number }>
  ) => {
    try {
      const response = await axios.put<FAQsResponse>("/api/profile/faqs", {
        faqOrders,
      });

      await mutate(response.data, { revalidate: false });

      return response.data.faqs;
    } catch (error) {
      console.error("Error reordering FAQs:", error);
      throw error;
    }
  };

  return {
    faqs: data?.faqs || [],
    isLoading,
    isError: error,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    reorderFAQs,
    mutate,
  };
}