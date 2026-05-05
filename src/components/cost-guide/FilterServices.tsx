import { FaArrowRightLong } from "react-icons/fa6";


interface ServicesProps {
  filterData: string;
  onChangeFilterData: (filter: string) => void;
  
}

export default function FilterServices(){
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
    <div className="grid gap-2 overflow-x-auto px-2 py-4  justify-left  ">
      {filters.map((filter) => (
        <h1
          key={filter}
          
          className="whitespace-nowrap  px-3 py-2 text-sm text-gray-800 transition hover:text-blue-500 hover:bg-blue-100 rounded-2xl"
        
        >
         
          {filter}

        </h1>
        
      ))}
    </div>
  );
};




