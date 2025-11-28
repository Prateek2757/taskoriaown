"use client";

import useSWR from "swr";
import { useMemo } from "react";


interface ProfessionalPackage {
  package_id: number;
  name: string;
  price: number;
    description?: string;
}
interface PackageResponse {
  packages: ProfessionalPackage[];
}

const fetcher = async (url: string): Promise<PackageResponse> => {
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }

  return res.json();
};

export function useProfessionalPackages() {
  const { data, error, isLoading, mutate } = useSWR<PackageResponse>(
    "/api/professional-package",
    fetcher,
    {
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      errorRetryInterval: 3000,
      errorRetryCount: 2,
    }
  );

  const packages = useMemo(() => data?.packages ?? [], [data]);

  return {
    packages,
    isLoading,
    error,
    hasError: Boolean(error),
    refresh: mutate,
  };
}