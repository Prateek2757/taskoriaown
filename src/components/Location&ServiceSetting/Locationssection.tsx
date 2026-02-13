"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MapPin, PlusCircle, XCircle, Edit2, Trash, Trash2 } from "lucide-react";
import AddLocationDialog from "./Addlocationdialog";
import EditLocationDialog from "./Editlocationdialog";

interface LocationsSectionProps {
  profile: any;
  userLocations: any[];
  saving: boolean;
  addLocation: (cityId: number, cityName: string, radius: number) => Promise<void>;
  updateLocation: (oldCityId: number, newCityId: number, newCityName: string, radius: number) => Promise<void>;
  toggleNationwide: (value: boolean) => void;
  onRemove: (cityId: number) => void;
}

export default function LocationsSection({
  profile,
  userLocations,
  saving,
  addLocation,
  updateLocation,
  toggleNationwide,
  onRemove,
}: LocationsSectionProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    city_id: number;
    city_name: string;
    radius: number;
  } | null>(null);

  const handleEditLocation = (location: any) => {
    setSelectedLocation({
      city_id: location.city_id,
      city_name: location.city_name,
      radius: location.radius,
    });
    setEditDialogOpen(true);
  };

  const existingCityIds = userLocations.map(loc => loc.city_id);

  return (
    <Card className="rounded-2xl shadow-lg border p-0 border-gray-200 dark:border-gray-700 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 px-6 py-5 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Your Locations
            </CardTitle>
          </div>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={profile.is_nationwide}
            onClick={() => setAddDialogOpen(true)}
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Add Location
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-2 space-y-4">
        <div className="min-h-[120px]">
          {profile.is_nationwide ? (
            <div className="flex items-center justify-center h-full py-8">
              <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-6 py-3 rounded-full text-base font-semibold shadow-sm">
                🌍 Nationwide Coverage
              </Badge>
            </div>
          ) : userLocations.length > 0 ? (
            <div className="flex flex-col gap-2">
              {userLocations.map((loc) => (
                <div
                  key={loc.id}
                  className="group relative bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium shadow-sm transition-all hover:shadow-md"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">Within {loc.radius} miles of {loc.city_name}</span>
                  {/* {loc.radius && (
                    <span className="text-xs opacity-75">
                      ({loc.radius} mile{loc.radius !== 1 ? 's' : ''})
                    </span>
                  )} */}
                  
                  <div className="flex   items-center gap-1 ml-auto opacity-100  transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditLocation(loc);
                      }}
                      disabled={saving}
                      className="p-1 hover:bg-blue-200 flex gap-1 dark:hover:bg-blue-700 rounded-full transition-colors"
                      title="Edit location"
                    >
                      <Edit2 className="w-6.5 h-4.5" />
                      <span className="flex items-center ">Edit</span>
               </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        !saving && onRemove(loc.city_id);
                      }}
                      disabled={saving}
                      className="p-1 hover:bg-red-200 flex gap-1 dark:hover:bg-red-700 rounded-full transition-colors"
                      title="Remove location"
                    >
                      <Trash2 className="w-6.5 h-4.5 items-center " />
                      <span className="flex items-center ">Remove</span>

                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 py-8">
              <p className="text-base font-medium">No locations selected yet</p>
              <p className="text-sm mt-1">Choose cities or enable nationwide</p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-gray-800 rounded-xl border border-blue-100 dark:border-gray-700">
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                Nationwide Service
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                Serve customers across the country
              </p>
            </div>
            <Switch
              checked={profile.is_nationwide}
              onCheckedChange={(val: boolean) => !saving && toggleNationwide(val)}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          <p className="text-xs  text-gray-500 dark:text-gray-400">
            💡 <strong>Tip:</strong> Click over a badge to edit the city/radius or remove it.
          </p>
        </div>
      </CardContent>

      <AddLocationDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        addLocation={addLocation}
      />

      {selectedLocation && (
        <EditLocationDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          location={selectedLocation}
          updateLocation={updateLocation}
          existingCityIds={existingCityIds}
        />
      )}
    </Card>
  );
}