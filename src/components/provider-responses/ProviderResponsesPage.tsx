"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";

import { useProviderResponses } from "../../hooks/useProviderResponses";

import ErrorState from "./ErrorState";
import StatsBar from "./StatsBar";
import SearchAndFilter from "./SearchAndFilter";
import LeadList from "./LeadList";
import DetailPanel from "./DetailPanel";
import EmptyState from "./EmptyState";
import { ProviderResponse } from "@/types";
import LeadSkeleton from "../skeleton/leadsskeleton";


export default function ProviderResponsesPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const { responses, loading, error, stats, refetch } = useProviderResponses();

  const [selected, setSelected] = useState<ProviderResponse | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
console.log(responses);

  useEffect(() => {
    if (responses.length > 0 && !selected) {
      setSelected(responses[0]);
    }
  }, [responses]);

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/login");
  }, [authStatus, router]);

  const filtered = responses.filter((r) => {
    const matchStatus =
      filterStatus === "all" || r.status?.toLowerCase() === filterStatus;
    const matchSearch =
      !searchQuery ||
      [r.customer_name, r.title, r.category_name]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (loading) return <LeadSkeleton />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-[#0d1117]  overflow-hidden">
      <div className="flex-shrink-0 px-4 pt-4 pb-3 bg-white dark:bg-[#0d1117] border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white leading-none">
              My Responses
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Track and manage all your task responses
            </p>
          </div>
        </div>
        <StatsBar stats={stats} />
      </div>

      <div className="flex flex-1 overflow-hidden">
      
        <aside
          className={`
            flex flex-col w-full lg:w-80 xl:w-96 flex-shrink-0
            border-r border-gray-200 dark:border-gray-800
            bg-white dark:bg-[#0d1117]
            ${selected ? "hidden lg:flex" : "flex"}
          `}
        >
          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={(v) => {
              setSearchQuery(v);
              setSelected(null);
            }}
            filterStatus={filterStatus}
            onFilterChange={(v) => {
              setFilterStatus(v);
              setSelected(null);
            }}
            stats={stats}
          />

          <LeadList
            responses={filtered}
            activeId={selected?.response_id ?? null}
            onSelect={(r) => setSelected(r)}
            searchQuery={searchQuery}
          />
        </aside>

     
        <main
          className={`
            flex-1 overflow-hidden
            ${selected ? "flex" : "hidden lg:flex"}
            flex-col
          `}
        >
          {selected ? (
            <DetailPanel
              key={selected.response_id}
              response={selected}
              onBack={() => setSelected(null)} 
            />
          ) : (
            <EmptyState
              title="Select a response"
              description="Click a lead on the left to view details, contact information, and activity."
            />
          )}
        </main>
      </div>
    </div>
  );
}
