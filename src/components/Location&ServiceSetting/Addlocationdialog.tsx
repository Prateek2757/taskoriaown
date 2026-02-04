"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Check, XCircle, Radar } from "lucide-react";
import LocationSearch from "@/components/Location/locationsearch";

const RADIUS_OPTIONS = [1, 2, 5, 10, 20, 30, 50, 75, 100, 125, 150] as const;

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgb(243 244 246);
    border-radius: 10px;
  }
  .dark .custom-scrollbar::-webkit-scrollbar-track {
    background: rgb(31 41 55);
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgb(209 213 219);
    border-radius: 10px;
  }
  .dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgb(75 85 99);
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgb(156 163 175);
  }
  .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgb(107 114 128);
  }
`;

interface AddLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addLocation: (cityId: number, cityName: string, radius: number) => Promise<void>;
}

export default function AddLocationDialog({
  open,
  onOpenChange,
  addLocation,
}: AddLocationDialogProps) {
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationSuccess, setLocationSuccess] = useState<string | null>(null);
  const [selectedRadius, setSelectedRadius] = useState<number>(10);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddLocation = async (data: { city_id?: number; city?: string } | null) => {
    if (!data) {
      setLocationError(null);
      setLocationSuccess(null);
      return;
    }

    if (!data.city_id || !data.city) {
      setLocationError("Invalid location data. Please select a valid location.");
      setTimeout(() => setLocationError(null), 5000);
      return;
    }

    setLocationError(null);
    setLocationSuccess(null);
    setIsAdding(true);

    try {
      await addLocation(data.city_id as any, data.city as any, selectedRadius);
      setLocationSuccess(`${data.city} (${selectedRadius} mile radius) added successfully!`);

      setTimeout(() => {
        onOpenChange(false);
        setLocationSuccess(null);
        setSelectedRadius(10);
        setIsAdding(false);
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to add location";
      setLocationError(errorMessage);
      setIsAdding(false);

      setTimeout(() => {
        setLocationError(null);
      }, 5000);
    }
  };

  const handleDialogChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setLocationError(null);
      setLocationSuccess(null);
      setSelectedRadius(10);
      setIsAdding(false);
    }
  };

  return (
    <>
      <style>{scrollbarStyles}</style>
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-visible flex flex-col">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-2xl font-bold dark:text-gray-100">
              Add Location
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 dark:text-gray-400">
              Select a city and service radius where you provide services.
            </DialogDescription>
          </DialogHeader>

          {locationSuccess && (
            <div
              className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300"
              role="alert"
            >
              <Check className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-sm">{locationSuccess}</p>
              </div>
            </div>
          )}

          {locationError && (
            <div
              className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300"
              role="alert"
            >
              <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-sm">Cannot add location</p>
                <p className="text-sm mt-0.5">{locationError}</p>
              </div>
              <button
                onClick={() => setLocationError(null)}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}

          {isAdding && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <div className="space-y-2">
                  <p className="text-blue-700 dark:text-blue-300 text-lg font-semibold">
                    Adding location...
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Please wait while we save your location
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-5 flex-1 flex flex-col">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-3 rounded-xl border border-blue-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Radar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Service Radius
                </label>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2.5 max-h-[200px] overflow-y-auto p-2 custom-scrollbar">
                {RADIUS_OPTIONS.map((radius) => (
                  <button
                    key={radius}
                    type="button"
                    onClick={() => setSelectedRadius(radius)}
                    disabled={isAdding}
                    className={`
                      relative py-2 px-2 rounded-lg font-semibold text-sm transition-all duration-200
                      ${
                        selectedRadius === radius
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105 ring-2 ring-blue-400"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
                      }
                      ${isAdding ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    {selectedRadius === radius && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-lg font-bold">{radius}</span>
                      <span className="text-[10px] opacity-90 leading-none">mi</span>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 text-center">
                Select how far you're willing to travel from the selected city
              </p>
            </div>

            <div className="flex-1">
              <LocationSearch onSelect={handleAddLocation}  />
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Radar className="w-4 h-4" />
                  <span>Coverage area:</span>
                </div>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {selectedRadius} mile radius
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}