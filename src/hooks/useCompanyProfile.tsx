"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export type Company = {
  user_id: number;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  about?: string;
  website?: string;
  company_size?: string;
  years_in_business?: number;
};

export const useCompanyProfile = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = axios.create({ baseURL: "", headers: { "Content-Type": "application/json" } });

  const fetchCompany = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/company");
      setCompany(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch company");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCompany = useCallback(async (data: Partial<Company>) => {
    setSaving(true);
    setError(null);
    try {
      const res = await api.put("/api/company", data);
      setCompany(res.data.company);
      return res.data;
    } catch (err: any) {
      setError(err.message || "Failed to update company");
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  return { company, loading, saving, error, fetchCompany, updateCompany };
};