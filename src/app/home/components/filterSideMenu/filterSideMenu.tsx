import { useAtom } from "jotai";

import { ArrowUp, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { isFilterOpenAtom } from "./atoms";
import { FilterSections } from "./constants";
import ActiveFilters from "./sections/activeFilters";
import Century from "./sections/century";
import Classifications from "./sections/classifications";
import Colors from "./sections/colors";
import ExcludedFilters from "./sections/excludedFilters";
import Materials from "./sections/materials";
import Periods from "./sections/periods";
import Person from "./sections/person";
import Place from "./sections/place";
import Technique from "./sections/technique";
import WorkType from "./sections/workType";

export default function FiltersSideMenu() {
  const [isFilterOpen, setIsFilterOpen] = useAtom(isFilterOpenAtom);
  // const [selectedFilters, setSelectedFilters] = useAtom(selectedFilters);
  // const [excludedFilters, setExcludedFilters] = useAtom(excludedFilters);
  const [selectedFilterSection, setSelectedFilterSection] = useState("Active Filters");
  const containerRef = useRef<HTMLDivElement>(null);
  const [showBackToStart, setShowBackToStart] = useState(false);

  const toggleFilterDetails = () => {
    setIsFilterOpen(true);
  };

  const renderSection = (section: string) => {
    switch (section) {
      case "activeFilters":
        return <ActiveFilters />;
      case "excludedFilters":
        return <ExcludedFilters />;
      case "colors":
        return <Colors />;
      case "classifications":
        return <Classifications />;
      case "workType":
        return <WorkType />;
      case "materials":
        return <Materials />;
      case "technique":
        return <Technique />;
      case "periods":
        return <Periods />;
      case "century":
        return <Century />;
      case "place":
        return <Place />;
      case "person":
        return <Person />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setShowBackToStart(containerRef.current.scrollTop > 50);
      }
    };
    containerRef.current?.addEventListener("scroll", handleScroll);
    return () => containerRef.current?.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative flex">
      <div className="bg-sweet-gray flex flex-col text-white border-r-almost-black border-r-[1px] z-[60] shadow-2xl">
        {FilterSections.map((section) => {
          return (
            section.shouldRender && (
              <div
                key={section.section}
                className={`flex gap-4 p-4 items-center border-transparent hover:border-white border-y-2 hover:shadow-2xl hover:bg-sweet-gray-light cursor-pointer ${
                  section.divisionLine ? "border-b-2 border-b-sweet-gray-dark" : ""
                } ${
                  selectedFilterSection === section.section
                    ? "bg-sweet-gray-light border-white border-opacity-30 bg-opacity-30 border-b-white shadow-2xl"
                    : ""
                }
                  `}
                onClick={() => {
                  toggleFilterDetails();
                  setSelectedFilterSection(section.section);
                }}
                title={section.displayName}
              >
                {section.icon}
                {isFilterOpen && <span className="text-xl cursor-pointer w-40">{section.displayName}</span>}
              </div>
            )
          );
        })}
      </div>

      <div
        ref={containerRef}
        className={`bg-sweet-gray flex flex-col gap-0 text-white w-[350px] transition-transform duration-200 ease-in-out overflow-y-auto no-scrollbar
          ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}
          absolute top-0 left-full h-full z-50`}
        style={{ willChange: "transform" }}
      >
        <div className="sticky top-2 flex justify-end  z-10">
          <button
            onClick={() => setIsFilterOpen(false)}
            className="text-white bg-transparent w-fit hover:bg-transparent hover:scale-110 transition-transform duration-300 ease-in-out px-0 mr-4"
          >
            <X size={32} />
          </button>
        </div>

        <div className="mt-[-36px]">{renderSection(selectedFilterSection)}</div>
        <div className="sticky bottom-4 flex justify-end z-10">
          {showBackToStart && (
            <button
              onClick={scrollToTop}
              className="w-fit h-fit flex justify-center text-almost-black bg-almost-white hover:scale-110 transition-transform duration-300 ease-in-out drop-shadow-xl p-1 rounded-full hover:bg-almost-white mr-4"
              title="Back to top"
            >
              <ArrowUp size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
