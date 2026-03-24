"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import NewRequestModal from "../leads/RequestModal";
import CategorySearch from "../category/CategorySearch";
import { useJoinAsProvider } from "@/hooks/useJoinAsProvider";
import Image from "next/image";

interface Category {
  category_id: number;
  name: string;
  slug?: string;
}

export default function HeroInteractive() {
  const [openModal, setOpenModal] = useState(false);
  const [slugvalue, setSlugValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const { joinAsProvider } = useJoinAsProvider();

  const handlePostJob = () => {
    setOpenModal(true);
  };
  const start = 1774250793;
  const end = 1776929193;
  
  // const startDate = new Date(start * 1000); // multiply by 1000 for milliseconds
  // const endDate = new Date(end * 1000);
  
  // console.log(startDate.toUTCString()); // e.g., Wed, 21 Jan 2026 09:46:33 GMT
  // console.log(endDate.toUTCString());
  const handleSelectCategory = (cat: Category | null) => {
    if (cat) {
      setSelectedCategory(cat);
      setOpenModal(true);
    }
  };

  return (
    <>
      <div className="max-w-2xl relative mx-auto mt-6 sm:px-4">
        <div className="absolute left-[-900px] top-[-15px] h-[200px] inset-0 pointer-events-none dark:opacity-80">
          <Image
            src="/images/herobgnew.avif"
            alt=""
            fill
            priority
            aria-hidden="true"
            className="object-contain object-center"
          />
        </div>

        <div className="relative w-full max-w-3xl group flex sm:items-center max-sm:gap-2">
          <div className="relative flex-1 sm:mr-4 w-full">
            {/* Hover glow ring */}
            <div
              className="absolute -inset-[2px] rounded-lg bg-[#3C7DED] blur-md opacity-0
                group-hover:opacity-100 transition duration-500"
              aria-hidden="true"
            />
            <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all duration-300">
              <CategorySearch
                onSelect={handleSelectCategory}
                placeholder="What service you need? (e.g. Cleaning, Web Development, Plumbing)"
                aria-label="Search for services"
              />
            </div>
          </div>

          {/* Browse-all anchor — still useful even without JS */}
          <Link
            href={`/services/${slugvalue}`}
            className="sm:w-auto sm:mt-0"
            aria-label="Browse all services"
          />
        </div>
      </div>

      {/* ── CTA buttons ── */}
      <div className="flex gap-2 pb-4 sm:gap-4 justify-center max-w-md mx-auto mt-6">
        <Button
          onClick={handlePostJob}
          disabled={loading}
          className="flex-1 py-5 bg-[#2563EB] text-white"
          aria-label="Post a job to find service providers"
        >
          Post a Job Free
          <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
        </Button>

        {/* Modal — only mounts when openModal is true, keeping initial JS lean */}
        <NewRequestModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          presetCategory={selectedCategory}
        />

        {/* Only shown to unauthenticated users */}
        {!session && (
          <Button
            variant="outline"
            onClick={() => joinAsProvider()}
            className="flex-1 py-5"
            aria-label="Register as a service provider"
          >
            Join as Provider
          </Button>
        )}
      </div>
    </>
  );
}