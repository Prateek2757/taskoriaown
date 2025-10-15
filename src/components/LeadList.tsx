"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Clock, Folder } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { cn } from "@/lib/utils";

interface Lead {
  task_id: number;
  title: string;
  description: string | null;
  min_budget: string | null;
  max_budget: string | null;
  location: string;
  category: string;
  postedTime: string;
  status: string;
}

interface LeadsListProps {
  search?: string; // ✅ passed from parent (dashboard or hero)
}

const LeadsList: React.FC<LeadsListProps> = ({ search = "" }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/leads");
      const mappedLeads = res.data.map((lead: any) => ({
        task_id: lead.task_id,
        title: lead.title,
        description: lead.description,
        min_budget: lead.budget_min,
        max_budget: lead.budget_max,
        location: lead.location_name || (lead.is_remote_allowed ? "Remote" : "N/A"),
        category: lead.category_name,
        postedTime: new Date(lead.created_at).toLocaleString(),
        status: lead.status,
      }));
      setLeads(mappedLeads);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(
    (lead) =>
      lead.title.toLowerCase().includes(search.toLowerCase()) ||
      lead.category.toLowerCase().includes(search.toLowerCase()) ||
      lead.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="h-12 w-12 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
        <p className="text-sm text-muted-foreground">Fetching the latest leads...</p>
      </div>
    );
  }

  if (filteredLeads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
        <div className="text-5xl">🔍</div>
        <p className="text-lg font-medium">No leads found</p>
        <p className="text-muted-foreground text-sm max-w-sm">
          Try adjusting your search or check back later for new opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredLeads.map((lead) => (
        <Card
          key={lead.task_id}
          className="group border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-[2px] relative"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-green-600"></div>

          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                  {lead.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Folder className="w-4 h-4 text-blue-600" />
                  {lead.category}
                </div>
              </div>
              <Badge
                className={cn(
                  "text-xs font-medium px-2 py-1 rounded-md",
                  lead.status === "Open"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                )}
              >
                {lead.status}
              </Badge>
            </div>

            {lead.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                {lead.description}
              </p>
            )}

            <div className="grid sm:grid-cols-3 gap-3 text-sm text-muted-foreground mt-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-500" />
                {lead.location}
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-green-500" />
                {lead.min_budget && lead.max_budget
                  ? `$${lead.min_budget} - $${lead.max_budget}`
                  : "N/A"}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                {lead.postedTime}
              </div>
            </div>

            <div className="pt-3">
              <Button
                size="sm"
                asChild
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <Link href={`/leads/${lead.task_id}`}>View Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LeadsList;