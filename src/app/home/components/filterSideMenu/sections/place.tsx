import { Tooltip } from "@nextui-org/tooltip";
import { useAtom } from "jotai";
import {
  ArrowDown01,
  ArrowDown10,
  ArrowDownAZ,
  ArrowDownZA,
  ChevronDown,
  ChevronUp,
  Loader2Icon,
  PackageOpen,
  Search
} from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../../libs/axios/axios";
import { capitalizeWords, formatNumber, formatNumberWithCommas } from "../../../../util/converters";
import { placesAtom, selectedFiltersAtom } from "../atoms";
import { FilterData, PlaceFilter, PlaceOrderType } from "../models";

export default function Place() {
  const [places, setPlaces] = useAtom<PlaceFilter[]>(placesAtom);
  const [selectedFilters, setSelectedFilters] = useAtom(selectedFiltersAtom);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPlaces, setFilteredPlaces] = useState<PlaceFilter[]>([]);
  const [orderType, setOrderType] = useState<PlaceOrderType>("objectCount-desc");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showSelectedOnly, setShowSelectedOnly] = useState<boolean>(false);
  const [expandedParents, setExpandedParents] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getPlaces = async (): Promise<PlaceFilter[]> => {
    try {
      const params: any = {
        size: 5000,
        sort: orderType.startsWith("objectCount") ? "objectcount" : "name",
        sortorder: orderType.endsWith("asc") ? "asc" : "desc"
      };
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await axiosInstance.get("proxy/place", {
        params
      });
      return response.data.records;
    } catch (error) {
      console.error("Failed to fetch places:", error);
      return [];
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    const fetchedPlaces = await getPlaces();
    setPlaces(fetchedPlaces);
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchInitialPlaces = async () => {
      setIsLoading(true);
      const fetchedPlaces = await getPlaces();
      setPlaces(fetchedPlaces);
      setIsLoading(false);
    };
    fetchInitialPlaces();
  }, [orderType]); // Re-fetch when orderType changes

  const hasMatchingChild = (parentPlace: PlaceFilter, term: string, allPlaces: PlaceFilter[]): boolean => {
    return allPlaces.some((place) => {
      const placeName = place.name?.toLowerCase() || "";
      if (
        place.parentplaceid === parentPlace.id &&
        (placeName.includes(term) || hasMatchingChild(place, term, allPlaces))
      ) {
        setExpandedParents((prev) => [...new Set([...prev, parentPlace.id])]);
        return true;
      }
      return false;
    });
  };

  useEffect(() => {
    let updatedPlaces = [...places];

    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      updatedPlaces = updatedPlaces.filter((place) => {
        const placeName = place.name?.toLowerCase() || "";
        return placeName.includes(searchTermLower) || hasMatchingChild(place, searchTermLower, places);
      });

      setExpandedParents((prev) => prev.filter((parentId) => updatedPlaces.some((place) => place.id === parentId)));
    } else {
      setExpandedParents([]);
    }

    if (showSelectedOnly) {
      updatedPlaces = updatedPlaces.filter((place) =>
        selectedFilters.places.map((filter) => filter.id).includes(place.id)
      );

      if (updatedPlaces.length === 0) {
        setShowSelectedOnly(false);
      }
    }

    updatedPlaces.sort((a, b) => {
      switch (orderType) {
        case "alphabetical-asc":
          return (a.name || "").localeCompare(b.name || "");
        case "alphabetical-desc":
          return (b.name || "").localeCompare(a.name || "");
        case "objectCount-desc":
          return b.objectcount - a.objectcount;
        case "objectCount-asc":
          return a.objectcount - b.objectcount;
        default:
          return 0;
      }
    });

    setFilteredPlaces(updatedPlaces);
  }, [places, orderType, showSelectedOnly, selectedFilters]);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleOrderChange = (
    type: "alphabetical-asc" | "alphabetical-desc" | "objectCount-desc" | "objectCount-asc"
  ) => {
    setOrderType(type);
    setShowDropdown(false);
  };

  const handleSelectPlace = (place: FilterData) => {
    setSelectedFilters((prev) => ({
      ...prev,
      places: prev.places.some((p) => p.id === place.id)
        ? prev.places.filter((p) => p.id !== place.id)
        : [...prev.places, place]
    }));
  };

  const toggleExpandPlace = (placeId: number) => {
    setExpandedParents((prev) => (prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId]));
  };

  const renderPlaces = (places: PlaceFilter[], parentId: number | null, level: number) => {
    return places
      .filter((place) => place.parentplaceid === parentId && place.objectcount > 0)
      .map((place) => (
        <div
          key={place.id}
          className={`flex flex-col mb-3 rounded-3xl shadow-inner ${
            level === 0 ? "bg-silver-gray-dark " : level === 1 ? "bg-silver-gray-darker" : "bg-silver-gray-darkest"
          }`}
        >
          {/* PARENT PLACE */}
          <Tooltip
            content={
              <div className="px-1 py-2 max-w-[280px]">
                <p className="font-semibold text-lg">{capitalizeWords(place.name)} </p>
                <p>
                  <span className="font-semibold">{formatNumberWithCommas(place.objectcount)}</span>{" "}
                  {place.objectcount > 1 ? "Items" : "Item"} Available
                </p>
                {place.haschildren && places.some((child) => child.parentplaceid === place.id) ? (
                  <p>
                    <span className="font-semibold">
                      {places.filter((child) => child.parentplaceid === place.id).length}
                    </span>{" "}
                    Subcategories
                  </p>
                ) : null}
              </div>
            }
            placement="right"
            showArrow
            delay={0}
            offset={16}
            closeDelay={0}
            classNames={{
              base: ["before:bg-silver-gray-darkest"],
              content: ["py-2 px-4 shadow-xl", "text-almost-white bg-silver-gray-darkest"]
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
              className={`flex items-center border-[1px] border-almost-white p-2 px-4 justify-between rounded-full cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out
                ${
                  selectedFilters.places.map((filter) => filter.id).includes(place.id)
                    ? "bg-almost-white bg-opacity-30"
                    : level === 0
                    ? "bg-silver-gray"
                    : level === 1
                    ? "bg-silver-gray-dark"
                    : "bg-silver-gray-darkest"
                } 
              `}
              onClick={() => handleSelectPlace(place)}
            >
              <span className="text-md font-medium max-w-[80%] line-clamp-2">{capitalizeWords(place.name)}</span>
              <span
                className={`text-sm font-medium ${
                  selectedFilters.places.map((filter) => filter.id).includes(place.id)
                    ? "text-almost-white"
                    : "text-silver-gray-lighter"
                }`}
                title={`${place.objectcount} Objects`}
              >
                {formatNumber(place.objectcount)}
              </span>
            </div>
          </Tooltip>

          {/* CHILD PLACES */}
          {place.haschildren &&
          expandedParents.includes(place.id) &&
          places.some((child) => child.parentplaceid === place.id) ? (
            <div
              className={`flex flex-col mt-3 pl-6 pr-2 rounded-b-2xl ${
                level === 0 ? "bg-silver-gray-dark " : level === 1 ? "bg-silver-gray-darker" : "bg-silver-gray-darkest"
              }`}
            >
              {expandedParents.includes(place.id) && renderPlaces(places, place.id, level + 1)}

              {/* STOP SHOWING CHILDREN PLACES */}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpandPlace(place.id);
                }}
                className="self-center bg-transparent hover:bg-transparent p-0 border-0 w-fit h-fit focus:outline-none mb-3"
              >
                <ChevronUp size={24} className="mt-1" />
              </button>
            </div>
          ) : null}

          {/* SHOW CHILDREN PLACES */}
          {place.haschildren &&
          !expandedParents.includes(place.id) &&
          places.some((child) => child.parentplaceid === place.id) ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpandPlace(place.id);
              }}
              className="self-center bg-transparent hover:bg-transparent p-0 border-0 w-fit h-fit focus:outline-none"
            >
              <ChevronDown size={24} className="mt-1" />
            </button>
          ) : (
            <div className="w-5" />
          )}
        </div>
      ));
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col text-white w-full transition-transform duration-200 ease-in-out">
      <h1 className="text-4xl font-bold mt-4 ml-4">Places</h1>

      <div className="flex flex-col w-full px-4">
        <div className="flex items-center gap-2 relative mt-6 mb-2">
          <input
            type="text"
            placeholder="Search place..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="p-2 border border-gray-400 rounded-lg w-full"
          />

          <button
            onClick={handleSearch}
            className="p-2 border border-gray-400 rounded-lg hover:bg-almost-white hover:bg-opacity-30 transition w-fit bg-transparent flex items-center gap-1"
          >
            <Search size={20} />
          </button>

          <button
            onClick={toggleDropdown}
            className="p-2 border border-gray-400 rounded-lg hover:bg-almost-white hover:bg-opacity-30 transition w-fit bg-transparent flex items-center gap-1"
          >
            {orderType === "objectCount-desc" && <ArrowDown10 size={20} />}
            {orderType === "objectCount-asc" && <ArrowDown01 size={20} />}
            {orderType === "alphabetical-asc" && <ArrowDownAZ size={20} />}
            {orderType === "alphabetical-desc" && <ArrowDownZA size={20} />}
          </button>

          {showDropdown && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white text-black rounded-2xl drop-shadow-2xl z-10 overflow-hidden border-[1px] border-white">
              <ul className="flex flex-col text-almost-white">
                <li
                  className={`p-2 bg-silver-gray-light hover:bg-silver-gray-lighter cursor-pointer ${
                    orderType === "objectCount-desc" ? "bg-silver-gray-lighter" : ""
                  }`}
                  onClick={() => handleOrderChange("objectCount-desc")}
                >
                  Object Count (Higher First)
                </li>
                <li
                  className={`p-2 bg-silver-gray-light hover:bg-silver-gray-lighter cursor-pointer ${
                    orderType === "objectCount-asc" ? "bg-silver-gray-lighter" : ""
                  }`}
                  onClick={() => handleOrderChange("objectCount-asc")}
                >
                  Object Count (Lower First)
                </li>
                <li
                  className={`p-2 bg-silver-gray-light hover:bg-silver-gray-lighter cursor-pointer ${
                    orderType === "alphabetical-asc" ? "bg-silver-gray-lighter" : ""
                  }`}
                  onClick={() => handleOrderChange("alphabetical-asc")}
                >
                  Alphabetical (A - Z)
                </li>
                <li
                  className={`p-2 bg-silver-gray-light hover:bg-silver-gray-lighter cursor-pointer ${
                    orderType === "alphabetical-desc" ? "bg-silver-gray-lighter" : ""
                  }`}
                  onClick={() => handleOrderChange("alphabetical-desc")}
                >
                  Alphabetical (Z - A)
                </li>
              </ul>
            </div>
          )}
        </div>

        {selectedFilters.places?.length > 0 && (
          <div className="flex items-center gap-2 ml-2">
            <input
              type="checkbox"
              id="show-selected-only"
              checked={showSelectedOnly}
              onChange={(e) => setShowSelectedOnly(e.target.checked)}
              className="cursor-pointer"
            />
            <label htmlFor="show-selected-only" className="cursor-pointer text-md">
              Show Selected Only
            </label>
          </div>
        )}

        {isLoading ? (
          <div className="self-center mt-8 flex flex-col items-center gap-2">
            <Loader2Icon size={80} className="animate-spin stroke-1" />
            <span className="text-sm">Loading Places</span>
          </div>
        ) : (
          <div className="flex flex-col my-4">
            {filteredPlaces.length !== 0
              ? renderPlaces(filteredPlaces, null, 0)
              : searchTerm !== "" && (
                  <div className="self-center flex flex-col items-center text-center max-w-[70%] ">
                    <PackageOpen size={64} className="stroke-1 text-silver-gray-lighter mb-4" />
                    <span className="mb-4">
                      No results for <span className="font-semibold">&quot;{searchTerm}&quot;</span>
                    </span>
                    <span>Try a different search term or adjust your filter.</span>
                  </div>
                )}
          </div>
        )}
      </div>
    </div>
  );
}
