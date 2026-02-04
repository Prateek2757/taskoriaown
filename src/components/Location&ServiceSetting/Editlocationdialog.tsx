"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Radar, MapPin, XCircle } from "lucide-react";
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

interface EditLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: {
    city_id: number;
    city_name: string;
    radius: number;
  };
  updateLocation: (oldCityId: number, newCityId: number, newCityName: string, radius: number) => Promise<void>;
  existingCityIds: number[];
}

export default function EditLocationDialog({
  open,
  onOpenChange,
  location,
  updateLocation,
  existingCityIds,
}: EditLocationDialogProps) {
  const [selectedRadius, setSelectedRadius] = useState<number>(location.radius);
  const [selectedCity, setSelectedCity] = useState<{
    city_id: number;
    city: string;
  } | null>({
    city_id: location.city_id,
    city: location.city_name,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset state when dialog opens or location changes
  useEffect(() => {
    if (open) {
      setSelectedRadius(location.radius);
      setSelectedCity({
        city_id: location.city_id,
        city: location.city_name,
      });
      setError(null);
      setSuccess(false);
      setIsUpdating(false); // Reset loading state when opening
    }
  }, [open, location]);

  // Reset states when dialog closes
  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset all states when closing
      setIsUpdating(false);
      setError(null);
      setSuccess(false);
    }
    onOpenChange(isOpen);
  };

  const hasChanges = 
    selectedRadius !== location.radius || 
    selectedCity?.city_id !== location.city_id;

  const handleLocationSelect = (data: { city_id?: number; city?: string } | null) => {
    if (!data || !data.city_id || !data.city) {
      setSelectedCity(null);
      return;
    }

    if (
      existingCityIds.includes(data.city_id) && 
      data.city_id !== location.city_id
    ) {
      setError("This location is already in your list");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setSelectedCity({
      city_id: data.city_id,
      city: data.city,
    });
    setError(null);
  };

  const handleUpdate = async () => {
    if (!hasChanges) {
      handleDialogChange(false);
      return;
    }

    if (!selectedCity) {
      setError("Please select a location");
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      await updateLocation(
        location.city_id,
        selectedCity.city_id,
        selectedCity.city,
        selectedRadius
      );
      setSuccess(true);
      setIsUpdating(false); 
      
      setTimeout(() => {
        handleDialogChange(false);
        setSuccess(false);
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to update location");
      setIsUpdating(false);
    }
  };

  return (
    <>
      <style>{scrollbarStyles}</style>
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-2xl font-bold dark:text-gray-100 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Edit Location
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 dark:text-gray-400">
              Update the city and service radius for this location
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg flex items-start gap-3 animate-in fade-in">
              <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 dark:text-red-400 hover:text-red-800"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg flex items-center gap-2 animate-in fade-in">
              <Check className="w-5 h-5" />
              <p className="font-semibold text-sm">Location updated successfully!</p>
            </div>
          )}

          {isUpdating && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <div className="space-y-2">
                  <p className="text-blue-700 dark:text-blue-300 text-lg font-semibold">
                    Updating location...
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Please wait while we save your changes
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-5 flex-1 overflow-y-auto custom-scrollbar">
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Current Location</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {location.city_name}
                    </p>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({location.radius} mile{location.radius !== 1 ? 's' : ''})
                    </span>
                  </div>
                </div>
                
                {hasChanges && (
                  <>
                    <div className="border-t border-blue-200 dark:border-blue-700 pt-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">New Location</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          {selectedCity?.city || "Not selected"}
                        </p>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ({selectedRadius} mile{selectedRadius !== 1 ? 's' : ''})
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2 px-2  ">
              <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Select New City
              </label>
              <LocationSearch 
                onSelect={handleLocationSelect}
            
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Search and select a different city, or keep the current one
              </p>
            </div>

            {/* Radius Selector */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-5 rounded-xl border border-blue-200 dark:border-gray-700">
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
                    disabled={isUpdating}
                    className={`
                      relative py-2 px-2 rounded-lg font-semibold text-sm transition-all duration-200
                      ${
                        selectedRadius === radius
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105 ring-2 ring-blue-400"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
                      }
                      ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}
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

            {/* Coverage Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Radar className="w-4 h-4" />
                  <span>Coverage area:</span>
                </div>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {selectedRadius} mile radius from {selectedCity?.city || location.city_name}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t dark:border-gray-700 mt-4">
            <Button
              variant="outline"
              onClick={() => handleDialogChange(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={!hasChanges || isUpdating || !selectedCity}
              className={`
                ${hasChanges && selectedCity
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "bg-gray-400 cursor-not-allowed"
                }
              `}
            >
              {isUpdating ? "Updating..." : hasChanges ? "Update Location" : "No Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}