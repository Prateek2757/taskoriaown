import { TbArrowNarrowRight } from "react-icons/tb";

interface ServicesProps {
  filterData: string;
  onChangeFilterData: (filter: string) => void;
}

export default function FilterServices({
  filterData,
  onChangeFilterData,
}: ServicesProps) {
  const filters = [
    "Cleaning Services",
    "Home Improvement & Trades",
    "Personal & Wellbeing",
    "Transport & Moving",
    "IT & Digital Services",
    "Events & Catering",
    "Pet Services",
    "Healthcare Services",
    "Food & Beverages",
    "Other Services",
  ];

  return (
    <div className="grid gap-2 overflow-x-auto px-2 py-4  justify-left    ">
      {filters.map((filter) => (
        <h1
          key={filter}
          onClick={() => onChangeFilterData(filter)}
          className={`group whitespace-nowrap flex justify-between gap-2 px-3 py-2 text-sm ${filterData === filter ? "text-blue-500 bg-blue-100 rounded-2xl cursor-pointer " : "text-gray-800 hover:text-blue-500 hover:bg-blue-100 rounded-2xl"} dark:text-white dark:hover:hover:bg-blue-950 text-blue-500  rounded-2xl`}
        >
          {filter}
          <TbArrowNarrowRight
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs"
            size={24}
          />
        </h1>
      ))}
    </div>
  );
}
