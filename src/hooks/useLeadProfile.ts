"use client";

import useSWR from "swr";
import axios from "axios";

export type Category = {
  category_id: number;
  category_name: string;
  name?: string;
};
export type City = { city_id: number; name: string };
export type UserLocation = {
  id: number;
  city_id: number;
  city_name: string;
  created_at: string;
};
export type Subscription = {
  package_id: number;
  start_date: string;
  end_date: string;
  status: string;
  payment_transaction_id: string;
};

export type Profile = {
  location_id: number | null;
  location_name?: string;
  is_nationwide: boolean;
  categories: Category[];
  display_name?: string;
  profile_image_url?: string;
  locations: UserLocation[];
  company_name?: string;
  company_size?: string;
  has_company?: boolean;
  logo_url?: string;
  is_pro?: boolean;
  active_subscription?: Subscription | null;
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useLeadProfile() {
  const {
    data: profile,
    error,
    isLoading,
    mutate,
  } = useSWR<Profile>("/api/user_profiles", fetcher);

  const { data: categories = [], mutate: mutateCategories } = useSWR<
    Category[]
  >("/api/signup/category-selection", fetcher);

  const { data: cities = [], mutate: mutateCities } = useSWR<City[]>(
    "/api/signup/location",
    fetcher
  );
  const { data: userLocations = [], mutate: mutateLocations } = useSWR<
    UserLocation[]
  >("/api/user_locations", fetcher);
  const saving = useSWR(() => null);

  const updateProfile = async (data: Partial<Profile>) => {
    if (!profile) return;
    try {
      const res = await axios.put("/api/user_profiles", data);
      mutate({ ...profile, ...res.data.profile }, { revalidate: true });
      return res.data.profile;
    } catch (err: any) {
      throw new Error(err.message || "Failed to update profile");
    }
  };

  const notifyAll = () => {
    window.dispatchEvent(new Event("categoriesUpdated"));
    window.dispatchEvent(new Event("locationUpdated"));
  };

  const addCategory = async (category_id: number, category_name: string) => {
    if (
      !profile ||
      profile.categories.some((c) => c.category_id === category_id)
    )
      return;
    try {
      mutate(
        {
          ...profile,
          categories: [...profile.categories, { category_id, category_name }],
        },
        false
      );
      await axios.post("/api/user_categories", { category_id });
      mutate(undefined, true);
      notifyAll();
    } catch {
      throw new Error("Failed to add category");
    }
  };

  const removeCategory = async (category_id: number) => {
    if (!profile) return;
    try {
      mutate(
        {
          ...profile,
          categories: profile.categories.filter(
            (c) => c.category_id !== category_id
          ),
        },
        false
      );
      await axios.delete("/api/user_categories", { data: { category_id } });
      mutate(undefined, true);
      notifyAll();
    } catch {
      throw new Error("Failed to remove category");
    }
  };

  const addLocation = async (city_id: number, city_name: string) => {
    if (userLocations.some((loc) => loc.city_id === city_id)) {
      throw new Error("Location already added");
    }
    try {
      const newLocation = {
        id: Date.now(),
        city_id,
        city_name,
        created_at: new Date().toISOString(),
      };
      mutateLocations([...userLocations, newLocation], false);

      await axios.post("/api/user_locations", { city_id });
      mutateLocations(undefined, true);
      notifyAll();
    } catch (err: any) {
      mutateLocations(userLocations, false); 
      throw new Error(err.response?.data?.message || "Failed to add location");
    }
  };

  const removeLocation = async (city_id: number) => {
    try {
      mutateLocations(
        userLocations.filter((loc) => loc.city_id !== city_id),
        false
      );

      await axios.delete("/api/user_locations", { data: { city_id } });
      mutateLocations(undefined, true);
      notifyAll();
    } catch (err: any) {
      mutateLocations(userLocations, false); 
      throw new Error("Failed to remove location");
    }
  };

  const setLocation = async (city_id: number, city_name: string) => {
    if (!profile) return;
    try {
      mutate(
        {
          ...profile,
          location_id: city_id,
          location_name: city_name,
          is_nationwide: false,
        },
        false
      );
      await axios.put("/api/user_profiles", {
        location_id: city_id,
        is_nationwide: false,
      });
      mutate(undefined, true);
      notifyAll();
    } catch {
      throw new Error("Failed to update location");
    }
  };

  const toggleNationwide = async (value: boolean) => {
    if (!profile) return;
    try {
      mutate(
        {
          ...profile,
          is_nationwide: value,
          location_id: value ? null : profile.location_id,
          location_name: value ? "" : profile.location_name,
        },
        false
      );
      await axios.put("/api/user_profiles", { is_nationwide: value });
      mutate(undefined, true);
      notifyAll();
    } catch {
      throw new Error("Failed to toggle nationwide");
    }
  };

  return {
    profile,
    categories,
    cities,
    userLocations,
    loading: isLoading,
    error,

    updateProfile,
    addCategory,
    removeCategory,
    addLocation,
    removeLocation,
    setLocation,
    toggleNationwide,
  };
}
