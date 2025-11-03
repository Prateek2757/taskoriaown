"use client";

import { useLeadProfile, Category, City } from "@/hooks/useLeadProfile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  MapPin,
  PlusCircle,
  ArrowLeft,
  XCircle,
  Search,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import LocationSearch from "@/components/Location/locationsearch";

export default function MyServicesPage() {
  const {
    profile,
    categories,
    loading,
    saving,
    error,
    addCategory,
    removeCategory,
    setLocation,
    toggleNationwide,
  } = useLeadProfile();

  const [catSearch, setCatSearch] = useState("");

  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<{
    type: "service" | "location";
    id: number | null;
  }>({
    type: "service",
    id: null,
  });

  const handleCategorySearch = useCallback(
    debounce((query: string) => {
      if (!query.trim()) {
        setFilteredCategories(categories.slice(0, 15));
        return;
      }
      const filtered = categories.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCategories(filtered);
    }, 250),
    [categories]
  );

  useEffect(() => {
    if (categories.length > 0 && serviceDialogOpen) {
      setFilteredCategories(categories.slice(0, 15));
    }
  }, [categories, serviceDialogOpen]);

  useEffect(
    () => handleCategorySearch(catSearch),
    [catSearch, handleCategorySearch]
  );

  const isCategorySelected = (categoryId: number) => {
    return (
      profile?.categories.some((c) => c.category_id === categoryId) ||
      selectedCategories.includes(categoryId)
    );
  };

  const toggleCategorySelection = (categoryId: number) => {
    if (isCategorySelected(categoryId)) {
      setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
      if (profile?.categories.some((c) => c.category_id === categoryId)) {
        removeCategory(categoryId);
      }
    } else {
      setSelectedCategories((prev) => [...prev, categoryId]);
    }
  };

  const handleAddSelectedCategories = () => {
    selectedCategories.forEach((categoryId) => {
      const category = categories.find((c) => c.category_id === categoryId);
      if (
        category &&
        !profile?.categories.some((c) => c.category_id === categoryId)
      ) {
        addCategory(category.category_id, category.name);
      }
    });
    setSelectedCategories([]);
    setServiceDialogOpen(false);
    setCatSearch("");
  };

  if (loading || !profile) {
    return (
      <div className="max-w-6xl mx-auto py-20 flex justify-center items-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="text-gray-500 text-lg">
            Loading your services and locations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-4 px-6 space-y-6">
      {/* Header */}
      <Link href="/provider/dashboard">
        <Button
          variant="ghost"
          size="lg"
          className="flex items-center gap-2 text-slate-600 hover:text-cyan-600"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </Button>
      </Link>
      <div className="flex items-center justify-center">
        <h1 className="text-3xl font-extrabold   text-slate-900 tracking-tight">
          Manage Your Services & Locations
        </h1>
      </div>

      <p className="text-gray-600 text-lg max-w-3xl">
        Select the services you offer and locations you serve. Choose multiple
        options to build a comprehensive profile.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Services Card */}
        <Card className="rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-emerald-50 px-6 py-5 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Your Services
              </CardTitle>
              <Dialog
                open={serviceDialogOpen}
                onOpenChange={setServiceDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" /> Add Services
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
                  <DialogHeader className="pb-4">
                    <DialogTitle className="text-2xl font-bold">
                      Add Services
                    </DialogTitle>
                    <DialogDescription className="text-base text-gray-600">
                      Select multiple services to add to your profile. Choose
                      2-6 options at once for best results.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="Search for services..."
                        value={catSearch}
                        onChange={(e) => setCatSearch(e.target.value)}
                        className="pl-11 h-12 text-base border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                      />
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 overflow-y-auto flex-1">
                      <div className="grid grid-cols-2 gap-3">
                        {filteredCategories.map((c) => {
                          const isSelected = isCategorySelected(c.category_id);
                          const isAlreadyAdded = profile.categories.some(
                            (pc) => pc.category_id === c.category_id
                          );

                          return (
                            <div
                              key={c.category_id}
                              onClick={() =>
                                !isAlreadyAdded &&
                                toggleCategorySelection(c.category_id)
                              }
                              className={`
                                flex items-center justify-between p-3.5 rounded-lg cursor-pointer transition-all
                                ${
                                  isAlreadyAdded
                                    ? "bg-cyan-100 text-cyan-800 cursor-not-allowed opacity-60"
                                    : isSelected
                                    ? "bg-cyan-100 text-cyan-800 border-2 border-cyan-500 shadow-sm"
                                    : "bg-white hover:bg-cyan-50 border border-gray-200 hover:border-cyan-300 hover:shadow-sm"
                                }
                              `}
                            >
                              <span className="font-medium text-sm">
                                {c.name}
                              </span>
                              {(isSelected || isAlreadyAdded) && (
                                <Check className="w-5 h-5 text-cyan-600 shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {filteredCategories.length === 0 && (
                        <div className="text-center py-12">
                          <p className="text-gray-500 text-base">
                            No services found
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            Try a different search term
                          </p>
                        </div>
                      )}
                    </div>

                    {selectedCategories.length > 0 && (
                      <div className="flex items-center justify-between bg-cyan-50 border border-cyan-200 p-4 rounded-xl">
                        <div>
                          <p className="text-sm font-semibold text-cyan-800">
                            {selectedCategories.length} service
                            {selectedCategories.length !== 1 ? "s" : ""}{" "}
                            selected
                          </p>
                          <p className="text-xs text-cyan-700">
                            Ready to add to your profile
                          </p>
                        </div>
                        <Button
                          onClick={handleAddSelectedCategories}
                          className="bg-cyan-600 hover:bg-cyan-700"
                        >
                          Add Selected
                        </Button>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <div className="min-h-[120px]">
              {profile.categories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.categories.map((c) => (
                    <Badge
                      key={c.category_id}
                      className="bg-cyan-100 text-cyan-800 px-4 py-2 text-sm rounded-full flex items-center gap-2 cursor-pointer hover:bg-red-100 hover:text-red-700 transition-all"
                      onClick={() => {
                        if (!saving) {
                          setPendingRemove({
                            type: "service",
                            id: c.category_id,
                          });
                          setConfirmOpen(true);
                        }
                      }}
                    >
                      {c.category_name} <XCircle className="w-3.5 h-3.5" />
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
                  <p className="text-base font-medium">
                    No services selected yet
                  </p>
                  <p className="text-sm mt-1">
                    Click "Add Services" to get started
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                💡 <strong>Tip:</strong> Click on a service badge to remove it
                from your profile
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Location Card */}
        <Card className="rounded-2xl shadow-lg border border-gray-200 overflow-hidde">
          <CardHeader className="bg-linear-to-r from-blue-50 to-cyan-50 px-6 py-5 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Your Locations
                </CardTitle>
              </div>
              <Dialog
                open={locationDialogOpen}
                onOpenChange={setLocationDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={profile.is_nationwide}
                  >
                    <PlusCircle className="w-4 h-4 mr-2" /> Add Location
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-visible flex flex-col">
                  <DialogHeader className="pb-4">
                    <DialogTitle className="text-2xl font-bold">
                      Add Location
                    </DialogTitle>
                    <DialogDescription className="text-base text-gray-600">
                      Select a city where you provide services. You can change
                      this anytime.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 flex-1 overflow-hiddn flex flex-col">
                    <div className="relative">
                      <LocationSearch
                        onSelect={(data) => {
                          setLocation(data.city_id, data.city);
                          setLocationDialogOpen(false);
                        }}
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <div className="min-h-[120px]">
              {profile.is_nationwide ? (
                <div className="flex items-center justify-center h-full py-8">
                  <Badge className="bg-blue-100 text-blue-700 px-6 py-3 rounded-full text-base font-semibold shadow-sm">
                    🌍 Nationwide Coverage
                  </Badge>
                </div>
              ) : profile.location_name ? (
                <div className="flex items-center justify-center h-full py-8">
                  <Badge
                    className="bg-blue-100 text-blue-800 px-6 py-3 rounded-full flex items-center gap-3 cursor-pointer hover:bg-red-100 hover:text-red-700 transition-all text-base font-medium shadow-sm"
                    onClick={() => {
                      if (!saving) {
                        setPendingRemove({ type: "location", id: null });
                        setConfirmOpen(true);
                      }
                    }}
                  >
                    <MapPin className="w-4 h-4" />
                    {profile.location_name}
                    <XCircle className="w-4 h-4" />
                  </Badge>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
                  <p className="text-base font-medium">
                    No location selected yet
                  </p>
                  <p className="text-sm mt-1">
                    Choose a city or enable nationwide
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-200 space-y-3">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div>
                  <p className="font-semibold text-gray-900">
                    Nationwide Service
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Serve customers across the country
                  </p>
                </div>
                <Switch
                  checked={profile.is_nationwide}
                  onCheckedChange={(val: boolean) =>
                    !saving && toggleNationwide(val)
                  }
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              <p className="text-xs text-gray-500">
                💡 <strong>Tip:</strong> Click on your location badge to remove
                it
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Messages */}
      {error && (
        <div
          className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-lg shadow-sm"
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
          className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 px-4 py-3 rounded-lg shadow-sm"
          role="alert"
        >
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
            <span className="font-medium">Saving your changes...</span>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600">
              Confirm Removal
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to remove this{" "}
              {pendingRemove.type === "service" ? "service" : "location"} ?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              No, Keep it
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (pendingRemove.type === "service" && pendingRemove.id) {
                  removeCategory(pendingRemove.id);
                } else if (pendingRemove.type === "location") {
                  setLocation(0, "");
                }
                setConfirmOpen(false);
              }}
            >
              Yes, Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
