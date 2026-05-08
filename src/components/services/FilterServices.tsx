

interface ServicesProps {
  filterData: string;
  onChangeFilterData: (filter: string) => void;
  
}

export default function FilterServices({ filterData, onChangeFilterData }: ServicesProps){
  const filters = [
    "All",
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
console.log("activefilter:", filterData)
  return (
    <div className="flex gap-2 overflow-x-auto px-2 py-1">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChangeFilterData(filter)}
          className={`whitespace-nowrap rounded-xl border px-3 py-2 text-sm transition
            ${
              filterData === filter
                ? "border-blue-600 bg-[#2563EB] text-white"
                : "border-slate-300 bg-gray-100 text-slate-600 hover:bg-blue-600 hover:text-white"
            }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};



