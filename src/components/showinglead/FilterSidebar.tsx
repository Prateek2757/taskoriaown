"use client";
import React, { useState } from "react";
import { Search, SlidersHorizontal, MapPin, DollarSign, Wifi, X, ChevronDown } from "lucide-react";

export interface Filters {
  search: string;
  category: string;
  location: string;
  budgetMin: string;
  budgetMax: string;
  status: string;
  isRemoteAllowed: boolean | null;
}


export interface Lead {
    category_name: string;
    location_name: string;
  }
  
  interface FilterSidebarProps {
    filters: Filters;
    leads: Lead[];
    onFilterChange: (updated: Partial<Filters>) => void;
  }

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, leads, onFilterChange }) => {
  const [categorySearch, setCategorySearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Extract unique categories and locations
  const allCategories = Array.from(new Set(leads.map(l => l.category_name).filter(Boolean)));
  const allLocations = Array.from(new Set(leads.map(l => l.location_name).filter(Boolean)));

  // Filter categories and locations based on search
  const filteredCategories = allCategories.filter(cat => 
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );
  const filteredLocations = allLocations.filter(loc => 
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const activeFiltersCount = [
    filters.category,
    filters.location,
    filters.budgetMin,
    filters.budgetMax,
    filters.isRemoteAllowed,
    filters.status !== "Open"
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    onFilterChange({
      search: "",
      category: "",
      location: "",
      budgetMin: "",
      budgetMax: "",
      status: "Open",
      isRemoteAllowed: null
    });
    setCategorySearch("");
    setLocationSearch("");
  };

  return (
    <div className="flex flex-col  p-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-2">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative pl-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by title or description..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="w-full pl-10 pr-2 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition text-sm"
            />
          </div>
        </div>

        {/* Status Pills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onFilterChange({ status: "Open" })}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                filters.status === "Open"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Open
            </button>
            <button
              onClick={() => onFilterChange({ status: "Urgent" })}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                filters.status === "Urgent"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Urgent
            </button>
          </div>
        </div>

        {/* Category Dropdown with Search */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 cursor-pointer hover:border-gray-400 transition flex items-center justify-between bg-white"
          >
            <span className={filters.category ? "text-gray-900 text-sm" : "text-gray-400 text-sm"}>
              {filters.category || "Select category..."}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`} />
          </div>
          
          {showCategoryDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
              <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="overflow-y-auto max-h-48">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterChange({ category: "" });
                    setShowCategoryDropdown(false);
                    setCategorySearch("");
                  }}
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                >
                  All Categories
                </div>
                {filteredCategories.map((cat) => (
                  <div
                    key={cat}
                    onClick={(e) => {
                      e.stopPropagation();
                      onFilterChange({ category: cat });
                      setShowCategoryDropdown(false);
                      setCategorySearch("");
                    }}
                    className={`px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm ${
                      filters.category === cat ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                    }`}
                  >
                    {cat}
                  </div>
                ))}
                {filteredCategories.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-400 text-center">
                    No categories found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Location Dropdown with Search */}
        <div className="relative">
          <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Location
          </label>
          <div
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 cursor-pointer hover:border-gray-400 transition flex items-center justify-between bg-white"
          >
            <span className={filters.location ? "text-gray-900 text-sm" : "text-gray-400 text-sm"}>
              {filters.location || "Select location..."}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showLocationDropdown ? "rotate-180" : ""}`} />
          </div>
          
          {showLocationDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
              <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="overflow-y-auto max-h-48">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterChange({ location: "" });
                    setShowLocationDropdown(false);
                    setLocationSearch("");
                  }}
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                >
                  All Locations
                </div>
                {filteredLocations.map((loc) => (
                  <div
                    key={loc}
                    onClick={(e) => {
                      e.stopPropagation();
                      onFilterChange({ location: loc });
                      setShowLocationDropdown(false);
                      setLocationSearch("");
                    }}
                    className={`px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm ${
                      filters.location === loc ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                    }`}
                  >
                    {loc}
                  </div>
                ))}
                {filteredLocations.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-400 text-center">
                    No locations found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Budget Range */}
        <div>
          <label className=" text-sm font-medium text-gray-700 mb-2  flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            Budget Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative ml-1 ">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">£</span>
              <input
                type="number"
                placeholder="Min"
                value={filters.budgetMin}
                onChange={(e) => onFilterChange({ budgetMin: e.target.value })}
                className="w-full pl-7 pr-2 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition text-sm"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">£</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.budgetMax}
                onChange={(e) => onFilterChange({ budgetMax: e.target.value })}
                className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition text-sm"
              />
            </div>
          </div>
        </div>

        {/* Remote Work Toggle */}
        <div>
          <label className="flex items-center justify-between p-3 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50 transition group">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                filters.isRemoteAllowed ? "bg-green-100" : "bg-gray-100"
              }`}>
                <Wifi className={`w-5 h-5 ${filters.isRemoteAllowed ? "text-green-600" : "text-gray-500"}`} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Remote Work</div>
                <div className="text-xs text-gray-500">Show remote opportunities</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={filters.isRemoteAllowed === true}
              onChange={(e) => onFilterChange({ isRemoteAllowed: e.target.checked ? true : null })}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
          </label>
        </div>

        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Active Filters
            </h3>
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
                  {filters.category}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-blue-900"
                    onClick={() => onFilterChange({ category: "" })}
                  />
                </span>
              )}
              {filters.location && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-md">
                  {filters.location}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-green-900"
                    onClick={() => onFilterChange({ location: "" })}
                  />
                </span>
              )}
              {(filters.budgetMin || filters.budgetMax) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-md">
                  £{filters.budgetMin || "0"} - £{filters.budgetMax || "∞"}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-purple-900"
                    onClick={() => onFilterChange({ budgetMin: "", budgetMax: "" })}
                  />
                </span>
              )}
              {filters.isRemoteAllowed && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-md">
                  Remote
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-teal-900"
                    onClick={() => onFilterChange({ isRemoteAllowed: null })}
                  />
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;