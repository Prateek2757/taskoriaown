"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import LeadCard from "./LeadCard";
import LeadDetails from "./LeadDetails";
import LoadingSpinner from "./LoadingSpinner";
import FilterSidebar from "./FilterSidebar";
import { Search, SlidersHorizontal } from "lucide-react";

export interface Lead {
  task_id?: number;
  title: string;
  location_name: string;
  category_name: string;
  created_at: string;
  phone: number;
  description: string;
  customer_name?: string;
  customer_email?: string;
  status?: string;
  budget_min?: number;
  budget_max?: number;
  is_remote_allowed?: boolean;
}

export interface Filters {
  search: string;
  category: string;
  location: string;
  budgetMin: string;
  budgetMax: string;
  status: string;
  isRemoteAllowed: boolean | null;
}

const LeadsPage: React.FC = () => {
  const [rawLeads, setRawLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "",
    location: "",
    budgetMin: "",
    budgetMax: "",
    status: "Open",
    isRemoteAllowed: null,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [taskCredits, setTaskCredits] = useState<Record<number, number>>({});
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);

  const filtersRef = useRef<HTMLDivElement>(null);

  // Fetch leads and task credit estimates
  useEffect(() => {
    const fetchLeadsAndCredits = async () => {
      try {
        setLoading(true);

        const [leadsRes, creditsRes] = await Promise.all([
          axios.get<Lead[]>("/api/leads"),
          axios.get("/api/admin/create-credit-estimate"),
        ]);

        const leadsData = Array.isArray(leadsRes.data) ? leadsRes.data : [];
        setRawLeads(leadsData);

        if (leadsData.length > 0) setSelectedLead(leadsData[0]);

        // Map task_id -> estimated_credits
        const creditsMap: Record<number, number> = {};
        (creditsRes.data.tasks || []).forEach(
          (c: { task_id: number; estimated_credits: number }) => {
            creditsMap[c.task_id] = c.estimated_credits;
          }
        );
        setTaskCredits(creditsMap);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch leads or credits.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeadsAndCredits();
  }, []);

  // Click outside to close filters
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(e.target as Node)) {
        setShowFilters(false);
      }
    };

    if (showFilters) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilters]);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return rawLeads.filter((lead) => {
      const matchesSearch =
        !filters.search ||
        lead.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        (lead.customer_name &&
          lead.customer_name.toLowerCase().includes(filters.search.toLowerCase()));

      const matchesCategory = !filters.category || lead.category_name === filters.category;
      const matchesLocation = !filters.location || lead.location_name === filters.location;
      const matchesBudgetMin = !filters.budgetMin || (lead.budget_max ?? 0) >= +filters.budgetMin;
      const matchesBudgetMax = !filters.budgetMax || (lead.budget_min ?? 0) <= +filters.budgetMax;
      const matchesStatus = !filters.status || lead.status === filters.status;
      const matchesRemote =
        filters.isRemoteAllowed === null || lead.is_remote_allowed === filters.isRemoteAllowed;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesBudgetMin &&
        matchesBudgetMax &&
        matchesStatus &&
        matchesRemote
      );
    });
  }, [rawLeads, filters]);

  const handleFilterChange = (newFilters: Partial<Filters>) =>
    setFilters((prev) => ({ ...prev, ...newFilters }));

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    if (window.innerWidth < 768) setIsMobileDetailsOpen(true);
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">
            Unable to load leads
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row md:h-screen min-h-screen bg-gray-50 font-sans relative">
      {/* Sidebar / Lead list */}
      <div
        className={`flex flex-col w-full md:w-[380px] border-r border-gray-200 bg-white transition-all duration-300 ${
          isMobileDetailsOpen ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Header with search + filters */}
        <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <h2 className="text-lg font-semibold text-gray-900 leading-none">
                {filteredLeads.length} matching leads
              </h2>
              <p className="text-sm text-gray-500 leading-none">
                {filters.category || "All services"} • {filters.location || "All locations"}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search leads by category"
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
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
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-white text-emerald-700 text-[10px] font-semibold rounded-full shadow-sm border border-emerald-600">
                    {Object.values(filters).filter(
                      (val) => val && val !== "" && !(typeof val === "boolean" && val === null) && !(val === "Open")
                    ).length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Lead list */}
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

      <div className="hidden md:block flex-1 overflow-y-auto p-6 bg-gray-50">
        {selectedLead ? (
          <LeadDetails
            lead={selectedLead}
            taskId={selectedLead.task_id}
            requiredCredits={taskCredits[Number(selectedLead.task_id)] || 0}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <h2>Select a lead to view details</h2>
          </div>
        )}
      </div>

      {/* Mobile Lead Details */}
      {isMobileDetailsOpen && selectedLead && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto animate-slideInUp">
          <div className="sticky top-0 flex justify-between p-4 border-b bg-gray-50 z-10">
            <button onClick={() => setIsMobileDetailsOpen(false)}>← Back</button>
            <h2 className="font-semibold text-gray-800">Lead Details</h2>
            <div />
          </div>
          <LeadDetails
            lead={selectedLead}
            taskId={selectedLead.task_id}
            requiredCredits={taskCredits[Number(selectedLead.task_id)] || 0}
          />
        </div>
      )}

      {/* Filters Sidebar */}
      {showFilters && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowFilters(false)} />
          <div ref={filtersRef} className="fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-2xl overflow-y-auto">
            <div className="flex justify-end p-4 border-b border-gray-200">
              <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700 transition">
                ✕ Close
              </button>
            </div>
            <FilterSidebar filters={filters} leads={rawLeads} onFilterChange={handleFilterChange} />
          </div>
        </>
      )}
    </div>
  );
};

export default LeadsPage;