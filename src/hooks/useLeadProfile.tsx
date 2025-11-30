"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export type Category = { category_id: number; category_name: string };
export type City = { city_id: number; name: string };
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
  company_name?:string;
  company_size?:string;
  has_company?:boolean;
  logo_url?:string;
  is_pro?: boolean;
  active_subscription?: Subscription | null;
};

export function useLeadProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = axios;
 
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/api/user_profiles");
        setProfile({
          ...data,
          categories: data.categories || [],
          is_pro: data.is_pro || false,
          active_subscription: data.active_subscription || null,
        });
      } catch {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const fetchCategories = async () => {
    if (categories.length) return;
    try {
      const { data } = await api.get("/api/signup/category-selection");
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load categories.");
    }
  };

  const fetchCities = async () => {
    if (cities.length) return;
    try {
      const { data } = await api.get("/api/signup/location");
      setCities(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load cities.");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchCities();
  }, []);

  const updateProfile = async (data: {
    display_name?: string;
    profile_image_url?: string;
  }) => {
    if (!profile) return;
    setSaving(true);
    try {
      const res = await api.put("/api/user_profiles", data);
      setProfile((p) => (p ? { ...p, ...res.data.profile } : p));
      return res.data.profile;
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const notifyAll = () => {
    window.dispatchEvent(new Event("categoriesUpdated"));
    window.dispatchEvent(new Event("locationUpdated"));
  };

  const addCategory = async (category_id: number, category_name: string) => {
    if (!profile || profile.categories.some((c) => c.category_id === category_id))
      return;

    setSaving(true);
    try {
      setProfile((p) =>
        p ? { ...p, categories: [...p.categories, { category_id, category_name }] } : p
      );
      await api.post("/api/user_categories", { category_id });
      notifyAll();
    } catch {
      setError("Failed to add category.");
    } finally {
      setSaving(false);
    }
  };

  const removeCategory = async (category_id: number) => {
    if (!profile) return;
    setSaving(true);
    try {
      setProfile((p) =>
        p
          ? { ...p, categories: p.categories.filter((c) => c.category_id !== category_id) }
          : p
      );
      await api.delete("/api/user_categories", { data: { category_id } });
      notifyAll();
    } catch {
      setError("Failed to remove category.");
    } finally {
      setSaving(false);
    }
  };

  
  const setLocation = async (city_id: number, city_name: string) => {
    if (!profile) return;
    setSaving(true);
    try {
      setProfile((p) =>
        p
          ? { ...p, location_id: city_id, location_name: city_name, is_nationwide: false }
          : p
      );
      await api.put("/api/user_profiles", { location_id: city_id, is_nationwide: false });
      notifyAll();
    } catch {
      setError("Failed to update location.");
    } finally {
      setSaving(false);
    }
  };

  const toggleNationwide = async (value: boolean) => {
    if (!profile) return;
    setSaving(true);
    try {
      setProfile((p) =>
        p
          ? {
              ...p,
              is_nationwide: value,
              location_id: value ? null : p.location_id,
              location_name: value ? "" : p.location_name,
            }
          : p
      );
      await api.put("/api/user_profiles", { is_nationwide: value });
      notifyAll();
    } catch {
      setError("Failed to toggle nationwide.");
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    categories,
    cities,
    loading,
    saving,
    error,
    fetchCategories,
    fetchCities,
    updateProfile,
    addCategory,
    removeCategory,
    setLocation,
    toggleNationwide,
  };
}
