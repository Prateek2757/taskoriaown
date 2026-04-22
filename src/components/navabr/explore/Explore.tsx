"use client";
import { useMemo, useState } from "react";
import { FaDigitalOcean, FaRegHeart } from "react-icons/fa";
import { GoTools } from "react-icons/go";
import { IoCaretDown, IoCaretUp, IoHeartOutline } from "react-icons/io5";
import {
  MdElectricalServices,
  MdEventAvailable,
  MdFastfood,
  MdKeyboardArrowRight,
  MdOutlinePets,
} from "react-icons/md";
import { PiSprayBottle } from "react-icons/pi";
import { BiArrowBack } from "react-icons/bi";
import { IoIosMore } from "react-icons/io";
import { LiaTruckMovingSolid } from "react-icons/lia";
import usePagination from "@/hooks/usePagination";
import { useCategories } from "@/hooks/useCategories";
import Link from "next/link";
import { TbGardenCart } from "react-icons/tb";


const exploreServices = [
  { label: "Cleaning Services", icon: <PiSprayBottle size={25} /> },
  { label: "Home Improvement & Trades", icon: <GoTools size={25} /> },
  { label: "Electrical & HVAC", icon: <MdElectricalServices size={28} /> },
  { label: "Transport & Moving", icon: <LiaTruckMovingSolid size={26} /> },
  { label: "Pet Services", icon: <MdOutlinePets size={24} /> },
  { label: "More", icon: <IoIosMore size={26} /> },
];

const moreServices = [

  { label: "Gardening & Outdoor ", icon: <TbGardenCart size={26} /> },
  { label: "Food & Beverages", icon: <MdFastfood size={26} /> },
  { label: "Events & Catering", icon: <MdEventAvailable size={26} /> },
  { label: "IT & Digital Services", icon: <FaDigitalOcean size={26} /> },
    { label: "Other Services", icon: <IoHeartOutline size={26} /> },
];

export default function Explore() {
  const [menuStack, setMenuStack] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const { categories } = useCategories();
  const { paginatedData } = usePagination(exploreServices, 6);

  const currentMenu = menuStack[menuStack.length - 1];
  const isMoreMenu = currentMenu === "More";

  const filteredCategories = useMemo(() => {
    if (!currentMenu || isMoreMenu || !categories) return [];
    return categories.filter(
      (cat) =>
        cat.main_category?.toLowerCase().trim() ===
        currentMenu.toLowerCase().trim(),
    );
  }, [currentMenu, categories]);

  const { paginatedData: paginatedCategories } = usePagination(
    filteredCategories,
    7,
  );
  console.log("dhjsdhjs:", paginatedCategories);
  const filteredPopularServices = useMemo(() => {
    if (!categories) return [];
    return categories.filter((cat) => cat?.slug);
  }, [categories]);

  const { paginatedData: paginatedFilteredPopularServices } = usePagination(
    filteredPopularServices,
    6,
  );
  const goToMenu = (menu: string) => {
    setMenuStack((prev) => [...prev, menu]);
  };

  const goBack = () => {
    setMenuStack((prev) => prev.slice(0, -1));
  };

  const currentMenuIcon =
    exploreServices.find((s) => s.label === currentMenu)?.icon ??
    moreServices.find((s) => s.label === currentMenu)?.icon;
  console.log("data:", filteredCategories);
  return (
    <>
      <div className="flex justify-between mx-4">
        <h1 className="text-md semi-bold hover:underline">Explore</h1>
        <button onClick={() => setShowMenu(!showMenu)}>
          {showMenu ?    <IoCaretDown
            size={20}
           /> :  <IoCaretUp size={20} />}
        </button>
      </div>

      {showMenu && (
        <div className="absolute left-12 top-full -mt-1 w-[320px] bg-white border border-gray-200 shadow-lg rounded-xl z-50 overflow-hidden">
          {/*  MAIN MENU  */}
          {menuStack.length === 0 && (
            <>
              <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                <h1 className="text-lg font-semibold text-black">Services</h1>

                <span className="text-md font-medium text-blue-600 cursor-pointer underline">
                  <Link href="/services">See all</Link>
                </span>
              </div>
              <div className="flex flex-col pb-2">
                {paginatedData.map((service) => (
                  <div
                    key={service.label}
                    onClick={() => goToMenu(service.label)}
                    className="flex items-center justify-between px-4  hover:text-black cursor-pointer group transition-colors duration-100"
                  >
                    <div className="flex items-center ">
                      <span className="text-gray-600  flex items-center justify-center hover:text-black">
                        {service.icon}
                      </span>
                      <span className="text-md text-gray-600 px-2 mt-2 hover:text-black hover:underline">
                        {service.label}
                      </span>
                    </div>
                    <MdKeyboardArrowRight size={20} className="text-gray-400 group-hover:text-gray-600 flex-shrink-0 ml-2 transition-colors" />
                  </div>
                ))}
                {/* POPULAR SERVICES */}
                <div className="px-4 pt-2 pb-2 flex items-center justify-between">
                  <h1 className="text-lg font-semibold text-black">
                    Popular Services
                  </h1>
                  <span className="text-md font-medium text-blue-600 cursor-pointer underline">
                    <Link href="/services">See all</Link>
                  </span>
                </div>
                <div className="flex  flex-col pb-2 hover:text-black">
                  {paginatedFilteredPopularServices.map((popularService) => (
                    <div className="flex items-center gap-3 px-4 py-1 ">
                      <span className="text-md text-gray-600 hover:text-black hover:underline">
                        <Link
                          key={popularService.category_id}
                          href={`/services/${popularService.slug}`}
                        >
                          {popularService?.name}
                        </Link>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* SUB-MENU */}
          {menuStack.length > 0 && (
            <div className="flex flex-col">
              <div className="px-5 pt-5 pb-4">
                <button
                  onClick={goBack}
                  className="flex items-center gap-2 group"
                >
                  <BiArrowBack
                    size={20}
                    className="text-gray-700 hover:text-black transition-colors"
                  />
                  <span className="text-lg  text-black hover:text-black hover:underline">
                    Back to Explore
                  </span>
                </button>
              </div>

              <hr className="border-t border-gray-200" />

              <div className="flex items-center justify-between px-5 pt-4 pb-3">
                <div className="flex items-center gap-1">
                  <span className="text-gray-600  flex items-center justify-center text-sm ">
                    {currentMenuIcon}
                  </span>
                  <h2 className="text-md  text-black">{currentMenu}</h2>
                </div>
                <span className="text-md font-medium text-blue-600 cursor-pointer underline">
                  See all
                </span>
              </div>

              <div className="flex flex-col pb-2">
                {isMoreMenu ? (
                  moreServices.map((service) => (
                    <div
                      key={service.label}
                      onClick={() => goToMenu(service.label)}
                      className="flex items-center justify-between px-4 py-1  cursor-pointer group transition-colors duration-100 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 flex items-center justify-center hover:text-black">
                          {service.icon}
                        </span>
                        <span className="text-md text-gray-600 px-2 mt-2 hover:text-black hover:underline underline-offset-4">
                          {service.label}
                        </span>
                      </div>
                      <MdKeyboardArrowRight
                        size={24}
                        className="text-gray-400 group-hover:text-gray-600 flex-shrink-0 ml-2 transition-colors"
                      />
                    </div>
                  ))
                ) : paginatedCategories.length > 0 ? (
                  paginatedCategories.map((cat) => (
                    <div
                      key={cat.category_id ?? cat.slug}
                      className="flex items-center justify-between px-5  cursor-pointer group transition-colors duration-100"
                    >
                      <span className="text-md text-gray-600 px-2 mt-2 hover:!text-black hover:underline hover:decoration-black hover:decoration-2 underline-offset-4">
                        <Link
                          key={cat.category_id}
                          href={`/services/${cat.slug}`}
                        >
                          {cat.name}
                        </Link>
                      </span>

                      <MdKeyboardArrowRight
                        size={24}
                        className="text-gray-400 group-hover:text-gray-600 flex-shrink-0 ml-2 transition-colors"
                      />
                    </div>
                  ))
                ) : (
                  <p className="px-5 py-3 text-sm text-gray-400">
                    No categories found
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
