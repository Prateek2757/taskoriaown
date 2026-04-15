"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
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
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
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
      <div className="max-w-2xl w-full mx-auto mt-6  flex flex-col gap-3">
        <div className="relative w-full px-2 group flex items-center">
          <div className="absolute right-170 -top-10 w-48 h-48 pointer-events-none dark:opacity-80 overflow-hidden">
            <Image
              src="/images/herobgnew.avif"
              alt=""
              fill
              priority
              aria-hidden="true"
              className="object-contain object-center"
              sizes="(max-width: 640px) 100vw,
              (max-width: 1024px) 50vw,
              33vw"

            />
          </div>

          <div
            className="absolute -inset-0.5 rounded-lg bg-[#3C7DED] blur-md opacity-0
             group-hover:opacity-100 transition duration-500"
            aria-hidden="true"
          />

          <div className="relative w-full flex items-center bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all duration-300">
            <CategorySearch
              onSelect={handleSelectCategory}
              placeholder="What service you need? (e.g. Cleaning, Web Development, Plumbing)"
              aria-label="Search for services"
            />
          </div>
        </div>
        <div className="flex gap-2 sm:gap-4  justify-center">
          <Button
            onClick={handlePostJob}
            disabled={loading}
            className={`py-5 bg-[#2563EB] text-white ${session ? "w-75" : ""}`}
            aria-label="Post a job to find service providers"
          >
            Get Free Quotes
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Button>

          {!session && (
            <Button
              variant="outline"
              onClick={() => joinAsProvider()}
              className=" px-4 py-5"
              aria-label="Register as a service provider"
            >
              Join as Provider
            </Button>
          )}
        </div>
      </div>

      <NewRequestModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        presetCategory={selectedCategory}
      />
    </>
  );
}
