
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FaDigitalOcean} from "react-icons/fa";
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
  { label: "Cleaning Services", icon: <PiSprayBottle size={20} /> },
  { label: "Home Improvement & Trades", icon: <GoTools size={20} /> },
  { label: "Electrical & HVAC", icon: <MdElectricalServices size={24} /> },
  { label: "Transport & Moving", icon: <LiaTruckMovingSolid size={20} /> },
  { label: "Pet Services", icon: <MdOutlinePets size={20} /> },
  { label: "More", icon: <IoIosMore size={24} /> },
];

const moreServices = [
  { label: "Gardening & Outdoor ", icon: <TbGardenCart size={22} /> },
  { label: "Food & Beverages", icon: <MdFastfood size={22} /> },
  { label: "Events & Catering", icon: <MdEventAvailable size={20} /> },
  { label: "IT & Digital Services", icon: <FaDigitalOcean size={18} /> },
  { label: "Other Services", icon: <IoHeartOutline size={22} /> },
];

export default function Explore() {
  const [menuStack, setMenuStack] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const { categories } = useCategories();
  const { paginatedData } = usePagination(exploreServices, 6);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowMenu(false);
        setMenuStack([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

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

  const { paginatedData: paginatedCategories } = usePagination(filteredCategories, 7);

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

  return (
    <div ref={containerRef}>
      <div className="flex justify-between mx-4">
        <h1 className="text-sm semi-bold hover:underline">Explore</h1>
        <button onClick={() => setShowMenu(!showMenu)}>
          {showMenu ? <IoCaretUp size={16} /> : <IoCaretDown size={16} />}
        </button>
      </div>

      {showMenu && (
        <div className="absolute left-12 top-full -mt-1 w-[320px] bg-white border border-gray-200 shadow-lg rounded-xl z-50 overflow-hidden dark:bg-slate-950 text-white">
          <AnimatePresence mode="popLayout" initial={false}>
            {menuStack.length === 0 ? (

              //  MAIN MENU 
              <motion.div
                key="main"
                initial={{ x: -320 }}
                animate={{ x: 0}}
                exit={{ x: -320 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                  <h1 className="text-sm font-semibold text-black dark:text-white">Services</h1>
                  <span className="text-sm font-medium text-blue-600 cursor-pointer underline">
                    <Link href="/services">See all</Link>
                  </span>
                </div>
                <div className="flex flex-col pb-2">
                  {paginatedData.map((service) => (
                    <div
                      key={service.label}
                      onClick={() => goToMenu(service.label)}
                      className="flex items-center justify-between px-4 hover:text-black cursor-pointer group transition-colors duration-100"
                    >
                      <div className="flex items-center">
                        <span className="text-gray-600 flex items-center hover:text-black dark:text-gray-400">
                          {service.icon}
                        </span>
                        <span className="text-sm text-gray-600 px-2 py-1 hover:text-black hover:underline dark:text-gray-400">
                          {service.label}
                        </span>
                      </div>
                      <MdKeyboardArrowRight size={16} className="text-gray-400 group-hover:text-gray-600 shrink-0 ml-2 transition-colors" />
                    </div>
                  ))}

                  <div className="px-4 pt-2 pb-2 flex items-center justify-between">
                    <h1 className="text-sm font-semibold text-black dark:text-gray-200">
                      Popular Services
                    </h1>
                    <span className="text-sm font-medium text-blue-600 cursor-pointer underline">
                      <Link href="/services">See all</Link>
                    </span>
                  </div>
                  <div className="flex flex-col pb-2 hover:text-black">
                    {paginatedFilteredPopularServices.map((popularService) => (
                      <div key={popularService.category_id} className="flex items-center gap-3 px-4 py-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400 hover:text-black hover:underline">
                          <Link href={`/services/${popularService.slug}`}>
                            {popularService?.name}
                          </Link>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

            ) : (

              //  SUB-MENU 
              <motion.div
                key={currentMenu}
                initial={{ x: 320 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 320 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col"
              >
                <div className="px-5 pt-5 pb-4">
                  <button onClick={goBack} className="flex items-center gap-2 group">
                    <BiArrowBack
                      size={20}
                      className="text-gray-700 hover:text-black transition-colors dark:text-gray-400"
                    />
                    <span className="text-sm text-black hover:text-black hover:underline dark:text-gray-400">
                      Back to Explore
                    </span>
                  </button>
                </div>

                <hr className="border-t border-gray-200" />

                <div className="flex items-center justify-between px-5 pt-4 pb-3">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600 flex items-center justify-center text-sm dark:text-gray-400">
                      {currentMenuIcon}
                    </span>
                    <h3 className="text-sm text-black dark:text-gray-100">{currentMenu}</h3>
                  </div>
                  <div className="flex">
                    <Link href="/services">
                     <span className="text-sm font-medium text-blue-600 cursor-pointer underline">
                    See all
                  </span>
                    </Link>
   
                  </div>
              
                </div>

                <div className="flex flex-col pb-2">
                  {isMoreMenu ? (
                    moreServices.map((service) => (
                      <div
                        key={service.label}
                        onClick={() => goToMenu(service.label)}
                        className="flex items-center justify-between px-4 py-1 cursor-pointer group transition-colors duration-100"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 flex items-center justify-center hover:text-black dark:text-gray-400">
                            {service.icon}
                          </span>
                          <span className="text-sm text-gray-600 px-2 mt-2 hover:text-black hover:underline dark:text-gray-400">
                            {service.label}
                            
                          </span>
                        </div>
                        <MdKeyboardArrowRight
                          size={24}
                          className="text-gray-400 group-hover:text-gray-600 shrink-0 ml-2 transition-colors"
                        />
                      </div>
                    ))
                  ) : paginatedCategories.length > 0 ? (
                    paginatedCategories.map((cat) => (
                      <div
                        key={cat.category_id ?? cat.slug}
                        className="flex items-center justify-between px-5 cursor-pointer group transition-colors duration-100"
                      >
                        <span className="text-sm text-gray-600 px-2 mt-2 light:hover:!text-black hover:underline hover:decoration-2 underline-offset-4 dark:text-gray-400">
                          <Link href={`/services/${cat.slug}`}>{cat.name}</Link>
                        </span>
                        <MdKeyboardArrowRight
                          size={16}
                          className="text-gray-400 group-hover:text-gray-600 shrink-0 ml-2 transition-colors"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="px-5 py-3 text-sm text-gray-400">No categories found</p>
                  )}
                </div>
              </motion.div>

            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}