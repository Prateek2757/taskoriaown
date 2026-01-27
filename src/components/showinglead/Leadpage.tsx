"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import LeadCard from "./LeadCard";
import LeadDetails from "./LeadDetails";
import LoadingSpinner from "./LoadingSpinner";
import FilterSidebar from "./FilterSidebar";
import { Search, SlidersHorizontal } from "lucide-react";
import { useCredit } from "@/hooks/useCredit";

export interface Lead {
  user_id?: string | number;
  task_id?: number;
  title: string;
  location_name: string;
  category_name: string;
  created_at: string;
  phone: number;
  description: string;
  latitude?: number;
  longitude?: number;
  postcode?: number;
  customer_name?: string;
  customer_email?: string;
  status?: string;
  estimated_budget?: number;
  is_remote_allowed?: boolean;
  is_seen?: boolean;
  seen_at?: string;
  queries?: string;
}

export interface Filters {
  search: string;
  category: string;
  location: string;
  status: string;
  estimated_budget: string;
  isRemoteAllowed: boolean | null;
}

const LeadsPage: React.FC = () => {
  const [rawLeads, setRawLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "",
    location: "",
    estimated_budget: "",
    status: "Open",
    isRemoteAllowed: null,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);
  const { taskCredits, fetchCreditEstimates, loading } = useCredit();
  const filtersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLeadsAndCredits = async () => {
      try {
        const { data } = await axios.get<Lead[]>("/api/leads");
        const leadsData = Array.isArray(data) ? data : [];
        setRawLeads(leadsData);
        // console.log(leadsData, "leadsData");

        if (leadsData.length > 0) setSelectedLead(leadsData[0]);
        await fetchCreditEstimates();
      } catch (err) {
        console.error(err);
        setError("Failed to fetch leads or credits.");
      }
    };
    fetchLeadsAndCredits();
  }, [fetchCreditEstimates]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        filtersRef.current &&
        !filtersRef.current.contains(e.target as Node)
      ) {
        setShowFilters(false);
      }
    };
    if (showFilters) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilters]);

  const unseenCount = rawLeads.filter((l) => !l.is_seen).length;

  const [initialOrder, setInitialOrder] = useState<number[]>([]);

  useEffect(() => {
    if (rawLeads.length > 0 && initialOrder.length === 0) {
      const sorted = [...rawLeads].sort((a, b) => {
        if (!a.is_seen && b.is_seen) return -1;
        if (a.is_seen && !b.is_seen) return 1;

        if (!a.is_seen && !b.is_seen) {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }

        if (a.is_seen && b.is_seen) {
          const aSeenTime = a.seen_at
            ? new Date(a.seen_at).getTime()
            : new Date(a.created_at).getTime();
          const bSeenTime = b.seen_at
            ? new Date(b.seen_at).getTime()
            : new Date(b.created_at).getTime();
          return bSeenTime - aSeenTime;
        }

        return 0;
      });

      setInitialOrder(sorted.map((l) => l.task_id!));
    }
  }, [rawLeads, initialOrder.length]);

  const sortedLeads = useMemo(() => {
    if (initialOrder.length === 0) return rawLeads;

    return [...rawLeads].sort((a, b) => {
      const indexA = initialOrder.indexOf(a.task_id!);
      const indexB = initialOrder.indexOf(b.task_id!);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      if (indexA === -1) return -1;
      if (indexB === -1) return 1;

      return 0;
    });
  }, [rawLeads, initialOrder]);

  const filteredLeads = useMemo(() => {
    return sortedLeads.filter((lead) => {
      const matchesSearch =
        !filters.search ||
        lead.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        (lead.customer_name &&
          lead.customer_name
            .toLowerCase()
            .includes(filters.search.toLowerCase()));
      const matchesBudget =
        !filters.estimated_budget ||
        (lead.estimated_budget ?? 0) >= +filters.estimated_budget;
      const matchesCategory =
        !filters.category || lead.category_name === filters.category;
      const matchesLocation =
        !filters.location || lead.location_name === filters.location;
      const matchesStatus = !filters.status || lead.status === filters.status;
      const matchesRemote =
        filters.isRemoteAllowed === null ||
        lead.is_remote_allowed === filters.isRemoteAllowed;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesBudget &&
        matchesStatus &&
        matchesRemote
      );
    });
  }, [sortedLeads, filters]);

  const handleFilterChange = (newFilters: Partial<Filters>) =>
    setFilters((prev) => ({ ...prev, ...newFilters }));

  const handleLeadClick = async (lead: Lead) => {
    setSelectedLead(lead);
    if (window.innerWidth < 768) setIsMobileDetailsOpen(true);

    if (!lead.is_seen) {
      axios.put(`/api/lead/${lead.task_id}`, { seen: true }).catch((err) => {
        console.error("Failed to mark lead as seen:", err);
      });

      const seenTimestamp = new Date().toISOString();

      setRawLeads((prev) =>
        prev.map((l) =>
          l.task_id === lead.task_id
            ? { ...l, is_seen: true, seen_at: seenTimestamp }
            : l
        )
      );

      setSelectedLead((prev) => {
        if (prev && prev.task_id === lead.task_id) {
          return { ...prev, is_seen: true, seen_at: seenTimestamp };
        }
        return prev;
      });
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Unable to load leads
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-cyan-500 text-white px-5 py-2 rounded-md hover:bg-cyan-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row md:h-screen min-h-screen bg-gray-50 dark:bg-gray-900 font-sans relative">
      <div
        className={`flex flex-col w-full md:w-[380px] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 ${
          isMobileDetailsOpen ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="sticky top-13 z-30 mb-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-none">
                  {filteredLeads.length} matching leads
                </h2>

                {unseenCount > 0 && (
                  <span className="px-2 py-1 text-xs font-semibold bg-blue-500 text-white rounded-full animate-pulse">
                    🔵 {unseenCount} New
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                {filters.category || "All services"} •{" "}
                {filters.location || "All locations"}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search leads by category"
                  value={filters.search}
                  onChange={(e) =>
                    handleFilterChange({ search: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                />
              </div>

              <button
                onClick={() => setShowFilters(true)}
                className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm font-medium rounded-lg shadow hover:opacity-90 active:scale-[0.98] transition"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>

                {Object.values(filters).some(
                  (val) =>
                    val &&
                    val !== "" &&
                    !(typeof val === "boolean" && val === null) &&
                    !(val === "Open")
                ) && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-white dark:bg-gray-700 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold rounded-full shadow-sm border border-emerald-600 dark:border-emerald-500">
                    {
                      Object.values(filters).filter(
                        (val) =>
                          val &&
                          val !== "" &&
                          !(typeof val === "boolean" && val === null) &&
                          !(val === "Open")
                      ).length
                    }
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-auto p-2 space-y-2">
          {filteredLeads.map((lead) => (
            <LeadCard
              key={lead.task_id}
              lead={lead}
              isSelected={selectedLead?.task_id === lead.task_id}
              onSelect={handleLeadClick}
              requiredCredits={taskCredits[Number(lead.task_id)] || 0}
            />
          ))}
        </div>
      </div>

      <div className="hidden md:block flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
        {selectedLead ? (
          <LeadDetails
            lead={selectedLead}
            userId={selectedLead.user_id}
            taskId={selectedLead.task_id}
            requiredCredits={taskCredits[Number(selectedLead.task_id)] || 0}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
            <h2>Select a lead to view details</h2>
          </div>
        )}
      </div>

      {isMobileDetailsOpen && selectedLead && (
        <div className="fixed inset-0 bg-white dark:bg-gray-800 z-50 overflow-y-auto animate-slideInUp">
          <div className="sticky top-0 flex justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 z-10">
            <button
              onClick={() => setIsMobileDetailsOpen(false)}
              className="text-gray-700 dark:text-gray-200"
            >
              ← Back
            </button>
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">
              Lead Details
            </h2>
            <div />
          </div>
          <LeadDetails
            lead={selectedLead}
            taskId={selectedLead.task_id}
            requiredCredits={taskCredits[Number(selectedLead.task_id)] || 0}
          />
        </div>
      )}

      {showFilters && (
        <>
          <div
            className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40"
            onClick={() => setShowFilters(false)}
          />
          <div
            ref={filtersRef}
            className="fixed top-0 left-0 z-50 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto"
          >
            <div className="flex justify-end p-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
              >
                ✕ 
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              leads={rawLeads}
              onFilterChange={handleFilterChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default LeadsPage;
