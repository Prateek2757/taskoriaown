"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowRight, Search, MapPin, LocateIcon, Locate } from "lucide-react";
import { Button } from "../../components/ui/button";
import NewRequestModal from "../leads/RequestModal";
import CategorySearch from "../category/CategorySearch";
import LocationSearch from "../Location/locationsearch";
import { useJoinAsProvider } from "@/hooks/useJoinAsProvider";
import Image from "next/image";

interface Category {
  category_id: number;
  name: string;
  slug?: string;
}

interface LocationType {
  place_id: string;
  city_id?: number;
  display_name: string;
  city?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
  lat?: number;
  lng?: number;
  _resolving?: boolean;
}

export default function HeroInteractive() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(
    null
  );
  const [initialStep, setInitialStep] = useState<1 | 2>(1);

  const { data: session } = useSession();
  const { joinAsProvider } = useJoinAsProvider();

  const handlePostJob = () => {
    if (selectedCategory && selectedLocation && !selectedLocation._resolving) {
      setInitialStep(2);
    } else {
      setInitialStep(1);
    }
    setOpenModal(true);
  };

  const handleSelectCategory = (cat: Category | null) => {
    setSelectedCategory(cat);
    if (!cat) return;
    if (selectedLocation && !selectedLocation._resolving) {
      setInitialStep(2);
      setOpenModal(true);
    }
  };

  const handleSelectLocation = (loc: LocationType | null) => {
    setSelectedLocation(loc);
    if (!loc || loc._resolving) return;
    if (selectedCategory) {
      setInitialStep(2);
      setOpenModal(true);
    }
  };

  return (
    <>
      <div className="max-w-2xl w-full mx-auto mt-6 flex flex-col gap-3">
        <div className="relative w-full px-2 group">
          <div className="absolute right-170 -top-10 w-48 h-48 pointer-events-none dark:opacity-80 overflow-hidden">
            <Image
              title="Hero Background Image"
              src="/images/herobgnew.avif"
              alt=""
              fill
              priority
              aria-hidden="true"
              className="object-contain object-center"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          <div
            className="absolute -inset-0.5 rounded-2xl bg-[#3C7DED] blur-md opacity-0
              group-hover:opacity-00 transition duration-500"
            aria-hidden="true"
          />

          <div className="relative w-full   px-6">
            <div className="flex flex-col md:flex-row gap-4 mb-5">
              <div className="flex-1 flex flex-col gap-1.5">
                {/* <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1.5 pl-1">
                  <Search className="w-3.5 h-3.5 text-gray-400" />
                  What service do you need?
                </label> */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-400 dark:hover:border-blue-500 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 overflw-hidden">
                  <CategorySearch
                    onSelect={handleSelectCategory}
                    placeholder="eg. Plumber, Cleaner, DJ etc"
                    aria-label="Search for a service"
                  />
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-1.5">
                {/* <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1.5 pl-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  Where do you need it?
                </label> */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-400 dark:hover:border-blue-500 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 overfow-hidden">
                  <LocationSearch
                    onSelect={handleSelectLocation}
                    presetLocation={selectedLocation}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handlePostJob}
                className="w-58 h-10 bg-[#2563EB] hover:bg-[#1d4fd8] text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                aria-label="Post a job to find service providers"
              >
                Get Free Quotes
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>

              {!session && (
                <Button
                  variant="outline"
                  onClick={() => joinAsProvider()}
                  className="w-58 h-10 rounded-lg font-medium border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                  aria-label="Register as a service provider"
                >
                  Join as Provider
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 pb-2 sm:mt-4 text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="w-4.5 h-4.5" />
          <span>Serving 50+ cities across Australia</span>
        </div>
      </div>

      <NewRequestModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        presetCategory={selectedCategory}
        presetLocation={selectedLocation}
        initialStep={initialStep}
      />
    </>
  );
}
