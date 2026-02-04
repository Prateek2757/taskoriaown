"use client";

import { useLeadProfile } from "@/hooks/useLeadProfile";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ConfirmDialog from "./Confirmdialog";
import LocationsSection from "./Locationssection";
import ServicesSection from "./ServiceSection";


export default function MyServicesPage() {
  const {
    profile,
    categories,
    userLocations,
    loading,
    saving,
    error,
    addCategory,
    removeCategory,
    addLocation,
    updateLocation,
    removeLocation,
    toggleNationwide,
  } = useLeadProfile();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<{
    type: "service" | "location";
    id: number | null;
  }>({
    type: "service",
    id: null,
  });

  const handleRemoveConfirm = (type: "service" | "location", id: number) => {
    setPendingRemove({ type, id });
    setConfirmOpen(true);
  };

  const handleConfirmRemoval = () => {
    if (pendingRemove.type === "service" && pendingRemove.id) {
      removeCategory(pendingRemove.id);
    } else if (pendingRemove.type === "location" && pendingRemove.id) {
      removeLocation(pendingRemove.id);
    }
    setConfirmOpen(false);
  };

  if (loading || !profile) {
    return (
      <div className="max-w-6xl mx-auto py-20 flex justify-center items-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-300 text-lg">
            Loading your services and locations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-4 px-6 space-y-6">
      <Link href="/provider/dashboard">
        <Button
          variant="ghost"
          size="lg"
          className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </Button>
      </Link>

      <div className="flex items-center justify-center">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Manage Your Services & Locations
        </h1>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl">
        Select the services you offer and locations you serve. Choose multiple
        options to build a comprehensive profile.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ServicesSection
          profile={profile}
          categories={categories}
          saving={saving}
          addCategory={addCategory}
          onRemove={(id) => handleRemoveConfirm("service", id)}
        />

        <LocationsSection
          profile={profile}
          userLocations={userLocations}
          saving={saving}
          addLocation={addLocation}
          updateLocation={updateLocation}
          toggleNationwide={toggleNationwide}
          onRemove={(id) => handleRemoveConfirm("location", id)}
        />
      </div>

      {error && (
        <div
          className="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg shadow-sm"
          role="alert"
        >
          <div className="flex items-center">
            <span className="font-bold mr-2">Error:</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {saving && (
        <div
          className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 dark:border-blue-700 text-blue-800 dark:text-blue-200 px-4 py-3 rounded-lg shadow-sm"
          role="alert"
        >
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-200 mr-3"></div>
            <span className="font-medium">Saving your changes...</span>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        type={pendingRemove.type}
        onConfirm={handleConfirmRemoval}
      />
    </div>
  );
}