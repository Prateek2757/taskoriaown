// "use client";
// import { useMemo, useState } from "react";
// import { FaRegHeart } from "react-icons/fa";
// import { GiFlowerPot } from "react-icons/gi";
// import { GoTools } from "react-icons/go";
// import { IoCaretDown } from "react-icons/io5";
// import { MdKeyboardArrowRight, MdOutlinePets } from "react-icons/md";
// import { PiSprayBottle } from "react-icons/pi";
// import usePagination from "@/hooks/usePagination";
// import { useCategories } from "@/hooks/useCategories";

// const exploreServices = [
//   { label: "Cleaning Services", icon: <PiSprayBottle size={33} /> },
//   { label: "Home Improvement & Trades", icon: <GoTools size={30} /> },
//   { label: "Healthcare Service", icon: <FaRegHeart size={30} /> },
//   { label: "Transport & Moving", icon: <GiFlowerPot size={32} /> },
//   { label: "Pet Services", icon: <MdOutlinePets size={32} /> },
// ];

// export default function Explore() {
//   const [activeService, setActiveService] = useState<string | null>(null);

//   const { paginatedData } = usePagination(exploreServices, 6);
//   const [showMenu, setShowMenu] = useState(false);
//   const { categories } = useCategories();
//   const filteredCategories = useMemo(() => {
//     if (!activeService || !categories) return [];
//     return categories.filter(
//       (cat) =>
//         cat.main_category?.toLowerCase().trim() ===
//         activeService?.toLowerCase().trim(),
//     );
//   }, [activeService, categories]);
//   console.log("categories sample:", categories?.slice(0, 3));
//   console.log("output:", filteredCategories);
//   console.log("activeService:", activeService);

//   return (
//     <>
//       <div className="flex justify-between mx-4">
//         <div className="flex ">
//           <h1 className="text-md semi-bold hover:underline">Explore</h1>
//         </div>
//         <button
//           className="flex my-1"
//           onClick={() => {
//             setShowMenu(!showMenu);
//           }}
//         >
//           <IoCaretDown
//             size={20}
//             className={`transition-transform duration-200 ${showMenu ? "rotate-180" : ""}`}
//           />
//         </button>
//       </div>
//       {showMenu && (
//         <div className="absolute  left-12 top-full -mt-1 w-1/6 h-80 bg-white border border-gray-100 shadow-lg rounded-md z-50 overflow-hidden">
//           <div className="px-4 pt-4 pb-2 flex items-center justify-between">
//             <h1 className="text-base font-semibold text-gray-800">Services</h1>
//             <span className="text-md font-medium cursor-pointer hover: underline">
//               See all
//             </span>
//           </div>

//           <div className="flex flex-col pb-2">
//             {exploreServices.map((service) => (
//               <div
//                 key={service.label}
//                 onClick={() =>
//                   setActiveService((prev) =>
//                     prev === service.label ? null : service.label,
//                   )
//                 }
//                 className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 cursor-pointer group"
//               >
//                 <div className="flex items-center gap-3">
//                   <span className="text-indigo-400 w-5 h-5 flex items-center justify-center">
//                     {service.icon}
//                   </span>
//                   <span className="text-md text-gray-700 group-hover:text-gray-900 hover:underline">
//                     {service.label}
//                   </span>
//                 </div>
//                 <MdKeyboardArrowRight size={26} className={"text-gray-700 "} />
//                 {activeService === service.label &&
//                   filteredCategories.length > 0 && (
//                     <div className="flex flex-col pb-2 bg-blue-500">
//                       {filteredCategories.map((cat) => (
//                         <div
//                           key={cat.category_id ?? cat.slug}
//                           className="flex items-center px-8 py-2 hover:bg-gray-100 cursor-pointer"
//                         >
//                           <span className="text-sm text-gray-700 hover:text-gray-900 hover:underline">
//                             {cat.name}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

"use client";
import { useMemo, useState } from "react";
import { FaDigitalOcean, FaRegHeart } from "react-icons/fa";
import { GiFlowerPot } from "react-icons/gi";
import { GoTools } from "react-icons/go";
import { IoCaretDown, IoHeartOutline } from "react-icons/io5";
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
import usePagination from "@/hooks/usePagination";
import { useCategories } from "@/hooks/useCategories";
import Link from "next/link";
import { TbGardenCart } from "react-icons/tb";


const exploreServices = [
  { label: "Cleaning Services", icon: <PiSprayBottle size={27} /> },
  { label: "Home Improvement & Trades", icon: <GoTools size={25} /> },
  { label: "Electrical & HVAC", icon: <MdElectricalServices size={26} /> },
  { label: "Transport & Moving", icon: <GiFlowerPot size={30} /> },
  { label: "Pet Services", icon: <MdOutlinePets size={24} /> },
  { label: "More", icon: <IoIosMore size={26} /> },
];

const moreServices = [
  { label: "Healthcare Service", icon: <IoHeartOutline size={26} /> },
  { label: "Gardening & Outdoor ", icon: <TbGardenCart size={26} /> },
  { label: "Food & Beverages", icon: <MdFastfood size={26} /> },
  { label: "Events & Catering", icon: <MdEventAvailable size={26} /> },
  { label: "IT & Digital Services", icon: <FaDigitalOcean size={26} /> },
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
  console.log("dhjsdhjs:",paginatedCategories)
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

  const currentMenuIcon = exploreServices.find(
    (s) => s.label === currentMenu,
  )?.icon ?? moreServices.find((s)=>s.label === currentMenu)?.icon;
  console.log("data:", filteredCategories);
  return (
    <>
      <div className="flex justify-between mx-4">
        <h1 className="text-md semi-bold hover:underline">Explore</h1>
        <button onClick={() => setShowMenu(!showMenu)}>
          <IoCaretDown
            size={20}
            className={`transition-transform duration-200 ${
              showMenu ? "rotate-180" : ""
            }`}
          />
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
                  See all
                </span>
              </div>
              <div className="flex flex-col pb-2">
                {paginatedData.map((service) => (
                  <div
                    key={service.label}
                    onClick={() => goToMenu(service.label)}
                    className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600  flex items-center justify-center">
                        {service.icon}
                      </span>
                      <span className="text-md text-gray-600 hover:text-black hover:underline">
                        {service.label}
                      </span>
                    </div>
                    <MdKeyboardArrowRight size={20} className="text-gray-400" />
                  </div>
                  
                ))}
                {/* POPULAR SERVICES */}
                <div className="px-4 pt-2 pb-2 flex items-center justify-between">
                  <h1 className="text-lg font-semibold text-black">
                    Popular Services
                  </h1>
                  <span className="text-md font-medium text-blue-600 cursor-pointer underline">
                    See all
                  </span>
                </div>
                <div className="flex  flex-col pb-2">
                  {paginatedFilteredPopularServices.map((popularService) => (
                    <div className="flex items-center gap-3 px-4 py-2 ">
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
                    className="text-gray-700 group-hover:text-gray-800 transition-colors"
                  />
                  <span className="text-lg  text-black">Back to Explore</span>
                </button>
              </div>

              {/* 2. Full-width divider */}
              <hr className="border-t border-gray-200" />
      
              
              <div className="flex items-center justify-between px-5 pt-4 pb-3">
                <div className="flex items-center gap-1">
                  <span className="text-gray-600  flex items-center justify-center text-sm ">
                    {currentMenuIcon}
                  </span>
                  <h2 className="text-md  text-black">{currentMenu }</h2>
                </div>
                <span className="text-md font-medium text-blue-600 cursor-pointer underline">
                  See all
                </span>
              </div>
            
            
              <div className="flex flex-col pb-5">
                {isMoreMenu ? (
                  moreServices.map((service) => (
                    <div
                      key={service.label}
                      onClick={() => goToMenu(service.label)}
                      className="flex items-center justify-between px-4 py-2  cursor-pointer group transition-colors duration-100 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 flex items-center justify-center">
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
                ) :
                paginatedCategories.length > 0 ? (
                  paginatedCategories.map((cat) => (
                    <div
                      key={cat.category_id ?? cat.slug}
                      className="flex items-center justify-between px-5 py-[9px]  cursor-pointer group transition-colors duration-100"
                    >
                      <span className="text-md text-gray-600 px-2 mt-2 hover:!text-black hover:underline hover:decoration-black hover:decoration-2 underline-offset-4">
                        {cat.name}
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
