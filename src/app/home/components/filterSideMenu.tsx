import { useAtom } from "jotai";
import {
  Blend,
  Brush,
  Calendar,
  CircleOff,
  Hourglass,
  MapPinned,
  Palette,
  PencilRuler,
  SquarePen,
  SquareUserRound,
  Tag
} from "lucide-react";
import { isFilterOpenAtom } from "../atoms";

export default function FiltersSideMenu() {
  const [isFilterOpen, setIsFilterOpen] = useAtom(isFilterOpenAtom);

  const toggleFilterDetails = () => {
    setIsFilterOpen((prev) => !prev);
  };

  return (
    <div className="relative flex">
      <div className="bg-sweet-gray flex flex-col text-white border-r-almost-black border-r-[1px] z-[60] shadow-2xl">
        <div
          className="flex gap-4 p-4 items-center border-transparent hover:border-white border-y-2 hover:shadow-2xl hover:bg-sweet-gray-light cursor-pointer"
          onClick={toggleFilterDetails}
          title="Active Filters"
        >
          <Blend size={32} />
          {isFilterOpen && <span className="text-xl cursor-pointer">Active Filters</span>}
        </div>
        <div
          className="flex gap-4 p-4 items-center border-transparent border-b-2 border-b-sweet-gray-dark hover:border-white border-y-2 hover:shadow-2xl hover:bg-sweet-gray-light cursor-pointer"
          onClick={toggleFilterDetails}
          title="Excluded Filters"
        >
          <CircleOff size={32} />
          {isFilterOpen && <span className="text-xl cursor-pointer whitespace-nowrap">Excluded Filters</span>}
        </div>

        <div
          className="flex gap-4 p-4 items-center border-transparent hover:border-white border-y-2 hover:shadow-2xl hover:bg-sweet-gray-light cursor-pointer"
          onClick={toggleFilterDetails}
          title="Colors"
        >
          <Palette size={32} />
          {isFilterOpen && <span className="text-xl cursor-pointer">Colors</span>}
        </div>
        <div
          className="flex gap-4 p-4 items-center border-transparent hover:border-white border-y-2 hover:shadow-2xl hover:bg-sweet-gray-light cursor-pointer"
          onClick={toggleFilterDetails}
          title="Classifications"
        >
          <Tag size={32} />
          {isFilterOpen && <span className="text-xl cursor-pointer">Classifications</span>}
        </div>
        <div
          className="flex gap-4 p-4 items-center border-transparent hover:border-white border-y-2 hover:shadow-2xl hover:bg-sweet-gray-light cursor-pointer"
          onClick={toggleFilterDetails}
          title="Work Type"
        >
          <SquarePen size={32} />
          {isFilterOpen && <span className="text-xl cursor-pointer">Work Type</span>}
        </div>
        <div
          className="flex gap-4 p-4 items-center border-transparent hover:border-white border-y-2 hover:shadow-2xl hover:bg-sweet-gray-light cursor-pointer"
          onClick={toggleFilterDetails}
          title="Materials"
        >
          <PencilRuler size={32} />
          {isFilterOpen && <span className="text-xl cursor-pointer">Materials</span>}
        </div>
        <div
          className="flex gap-4 p-4 items-center border-transparent hover:border-white border-y-2 hover:shadow-2xl hover:bg-sweet-gray-light cursor-pointer"
          onClick={toggleFilterDetails}
          title="Technique"
        >
          <Brush size={32} />
          {isFilterOpen && <span className="text-xl cursor-pointer">Technique</span>}
        </div>
        <div
          className="flex gap-4 p-4 items-center border-transparent hover:border-white border-y-2 hover:shadow-2xl hover:bg-sweet-gray-light cursor-pointer"
          onClick={toggleFilterDetails}
          title="Periods"
        >
          <Calendar size={32} />
          {isFilterOpen && <span className="text-xl cursor-pointer">Periods</span>}
        </div>
        <div
          className="flex gap-4 p-4 items-center border-transparent hover:border-white border-y-2 hover:shadow-2xl hover:bg-sweet-gray-light cursor-pointer"
          onClick={toggleFilterDetails}
          title="Century"
        >
          <Hourglass size={32} />
          {isFilterOpen && <span className="text-xl cursor-pointer">Century</span>}
        </div>
        <div
          className="flex gap-4 p-4 items-center border-transparent hover:border-white border-y-2 hover:shadow-2xl hover:bg-sweet-gray-light cursor-pointer"
          onClick={toggleFilterDetails}
          title="Place"
        >
          <MapPinned size={32} />
          {isFilterOpen && <span className="text-xl cursor-pointer">Place</span>}
        </div>
        <div
          className="flex gap-4 p-4 items-center border-transparent hover:border-white border-y-2 hover:shadow-2xl hover:bg-sweet-gray-light cursor-pointer"
          onClick={toggleFilterDetails}
          title="Person"
        >
          <SquareUserRound size={32} />
          {isFilterOpen && <span className="text-xl cursor-pointer">Person</span>}
        </div>
      </div>

      <div
        className={`bg-sweet-gray flex flex-col gap-2 text-white w-[350px] transition-transform duration-200 ease-in-out 
          ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}
          absolute top-0 left-full h-full z-50`}
        style={{ willChange: "transform" }}
      >
        <h1 className="text-4xl text-center font-bold mt-4">Filter Details</h1>
      </div>
    </div>
  );
}
