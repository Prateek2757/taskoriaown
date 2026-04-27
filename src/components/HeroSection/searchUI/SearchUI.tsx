import RequestModal from "../../leads/RequestModal"
import CategorySearch from "./CategorySearch";
import LocationSearch from "./LocationSearch";

export default function SearchUI() {
  return (
    <section className="flex flex-row justify-content-start section-padding">
      <div className="flex flex-row input-and-btn-row w-100">
        <CategorySearch />{" "}
      </div>
      <div className="input-group icon-left right-input align-items-center full-postcode-input ">
        <LocationSearch />
      </div>
      <div className="input-group icon-left right-input align-items-center full-postcode-input ml-2 ">
       <button className="bg-blue-500  pl-5 pr-9 border- py-2 max-sm:text-sm text-white flex-right text-center rounded-lg shadow-lg ">Search</button>
      </div>
    </section>
  );
}
