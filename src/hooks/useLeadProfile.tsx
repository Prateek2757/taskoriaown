"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";

export type Category = { category_id: number; name: string };
export type City = { city_id: number; name: string };
export type Profile = {
  location_id: number | null;
  location_name?: string;
  is_nationwide: boolean;
  categories: { category_id: number; category_name: string }[];
  display_name?: string;
};

export function useLeadProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = useMemo(
    () => axios.create({ baseURL: "", headers: { "Content-Type": "application/json" } }),
    []
  );

  // ---------- Fetchers ----------
  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/api/user_profiles");
      if (data && typeof data === "object") data.categories = data.categories ?? [];
      setProfile(data);
    } catch {
      setError("Failed to load profile.");
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/api/signup/category-selection");
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load categories.");
    }
  };

  const fetchCities = async () => {
    try {
      const { data } = await api.get("/api/signup/location");
      setCities(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load cities.");
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchProfile(), fetchCategories(), fetchCities()]);
      setLoading(false);
    })();
  }, []);

  // ---------- Actions ----------
  const notifyAll = () => {
    window.dispatchEvent(new Event("categoriesUpdated"));
    window.dispatchEvent(new Event("locationUpdated"));
  };

  const addCategory = async (category_id: number, category_name: string) => {
    if (!profile || profile.categories.some((c) => c.category_id === category_id)) return;
    setSaving(true);
    try {
      setProfile((p) => (p ? { ...p, categories: [...p.categories, { category_id, category_name }] } : p));
      await api.post("/api/user_categories", { category_id });
      notifyAll();
    } catch {
      setError("Failed to add category.");
      await fetchProfile();
    } finally {
      setSaving(false);
    }
  };

  const removeCategory = async (category_id: number) => {
    if (!profile) return;
    setSaving(true);
    try {
      setProfile((p) => (p ? { ...p, categories: p.categories.filter((c) => c.category_id !== category_id) } : p));
      await api.delete("/api/user_categories", { data: { category_id } });
      notifyAll();
    } catch {
      setError("Failed to remove category.");
      await fetchProfile();
    } finally {
      setSaving(false);
    }
  };

  const setLocation = async (city_id: number, city_name: string) => {
    if (!profile) return;
    setSaving(true);
    try {
      setProfile((p) => (p ? { ...p, location_id: city_id, location_name: city_name, is_nationwide: false } : p));
      await api.put("/api/user_profiles", { location_id: city_id, is_nationwide: false });
      notifyAll();
    } catch {
      setError("Failed to update location.");
      await fetchProfile();
    } finally {
      setSaving(false);
    }
  };

  const toggleNationwide = async (value: boolean) => {
    if (!profile) return;
    setSaving(true);
    try {
      setProfile((p) =>
        p ? { ...p, is_nationwide: value, location_id: value ? null : p.location_id, location_name: value ? "" : p.location_name } : p
      );
      await api.put("/api/user_profiles", { is_nationwide: value });
      notifyAll();
    } catch {
      setError("Failed to toggle nationwide.");
      await fetchProfile();
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
    addCategory,
    removeCategory,
    setLocation,
    toggleNationwide,
  };
}
