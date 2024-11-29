import { useAtom } from "jotai";

import { Tooltip } from "@nextui-org/tooltip";
import { ArrowUp, ChevronLeft, Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { isFilterOpenAtom, negativeFiltersAtom, selectedFiltersAtom } from "./atoms";
import { FilterSections } from "./constants";
import ActiveFilters from "./sections/activeFilters";
import Century from "./sections/century";
import Classifications from "./sections/classifications";
import Colors from "./sections/colors";
import Culture from "./sections/culture";
import ExcludedFilters from "./sections/excludedFilters";
import Materials from "./sections/materials";
import Periods from "./sections/periods";
import Person from "./sections/person";
import Place from "./sections/place";
import Technique from "./sections/technique";
import WorkType from "./sections/workType";

export default function FiltersSideMenu() {
  const [isFilterOpen, setIsFilterOpen] = useAtom(isFilterOpenAtom);
  const [selectedFilterSection, setSelectedFilterSection] = useState("Active Filters");
  const [selectedFilters] = useAtom(selectedFiltersAtom);
  const [negativeFilters] = useAtom(negativeFiltersAtom);
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
      case "culture":
        return <Culture />;
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
      <div className="bg-silver-gray flex flex-col text-white border-r-almost-black border-r-[1px] z-[60] shadow-2xl">
        {FilterSections.map((section) => {
          return (
            section.shouldRender && (
              <Tooltip
                key={section.section}
                content={
                  <div className="px-1 py-2 max-w-[280px]">
                    <p className="font-semibold text-lg">{section.displayName} </p>
                  </div>
                }
                placement="right"
                isDisabled={isFilterOpen}
                showArrow
                delay={0}
                offset={16}
                closeDelay={0}
                classNames={{
                  base: ["before:bg-silver-gray-dark"],
                  content: ["py-2 px-4 shadow-xl", "text-almost-white bg-silver-gray-dark"]
                }}
                motionProps={{
                  variants: {
                    exit: {
                      opacity: 0,
                      transition: {
                        duration: 0.1,
                        ease: "easeIn"
                      }
                    },
                    enter: {
                      opacity: 1,
                      transition: {
                        duration: 0.15,
                        ease: "easeOut"
                      }
                    }
                  }
                }}
              >
                <div
                  key={section.section}
                  className={`flex gap-4 p-4 items-center border-transparent hover:border-white border-y-2 hover:shadow-2xl hover:bg-silver-gray-light cursor-pointer ${
                    section.divisionLine ? "border-b-2 border-b-silver-gray-darker" : ""
                  } ${
                    selectedFilterSection === section.section && isFilterOpen
                      ? "bg-silver-gray-light border-white border-opacity-30 bg-opacity-30 border-b-white shadow-2xl"
                      : ""
                  }
                  `}
                  onClick={() => {
                    toggleFilterDetails();
                    setSelectedFilterSection(section.section);
                  }}
                >
                  <div className="relative">
                    {section.icon}
                    {section.section === "activeFilters" &&
                      (Object.values(selectedFilters).flat().length > 0 ||
                        Object.values(negativeFilters).flat().length > 0) && (
                        <div className="absolute top-[-6px] right-[-6px] bg-white text-black text-sm rounded-full w-[22px] h-[22px] p-1 flex items-center justify-center font-bold">
                          {Object.values(selectedFilters).flat().length + Object.values(negativeFilters).flat().length}
                        </div>
                      )}
                  </div>

                  {isFilterOpen && <span className="text-xl cursor-pointer w-40">{section.displayName}</span>}
                </div>
              </Tooltip>
            )
          );
        })}
      </div>

      <div
        className={`bg-silver-gray flex text-white w-fit transition-transform duration-200 ease-in-out 
          ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}
          absolute top-0 left-full h-full z-50`}
        style={{ willChange: "transform" }}
      >
        <div
          className="w-[350px] flex flex-col gap-0 overflow-y-auto no-scrollbar border-r-2 border-r-silver-gray-darker"
          ref={containerRef}
        >
          <div>{renderSection(selectedFilterSection)}</div>
        </div>
        <div className="w-10 bg-silver-gray-dark flex flex-col justify-between p-1 items-center px-4">
          <div className="flex flex-col gap-2 items-center">
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-almost-white bg-transparent w-fit h-fit hover:scale-110 transition-transform duration-300 ease-in-out p-0 hover:bg-transparent focus:scale-110 focus:outline-none"
            >
              <ChevronLeft size={36} />
            </button>

            <Tooltip
              showArrow={true}
              content="Scroll click to desactive filter"
              placement="right"
              offset={10}
              classNames={{
                base: [
                  // arrow color
                  "before:bg-silver-gray"
                ],
                content: ["py-2 px-4 shadow-xl", "text-almost-white bg-silver-gray"]
              }}
              delay={0}
              closeDelay={0}
              motionProps={{
                variants: {
                  exit: {
                    opacity: 0,
                    transition: {
                      duration: 0.1,
                      ease: "easeIn"
                    }
                  },
                  enter: {
                    opacity: 1,
                    transition: {
                      duration: 0.15,
                      ease: "easeOut"
                    }
                  }
                }
              }}
            >
              <div>
                <Info size={28} />
              </div>
            </Tooltip>
          </div>

          <div className="flex flex-col gap-2">
            {showBackToStart && (
              <button
                onClick={scrollToTop}
                className="w-fit h-fit flex justify-center bg-transparent text-almost-white hover:scale-110 transition-transform duration-300 ease-in-out p-0 hover:bg-transparent focus:scale-110 focus:outline-none"
                title="Back to top"
              >
                <ArrowUp size={36} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
