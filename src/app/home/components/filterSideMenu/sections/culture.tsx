import { useAtom } from "jotai";
import { ArrowDown01, ArrowDown10, ArrowDownAZ, ArrowDownZA, Loader2Icon, PackageOpen } from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../../libs/axios/axios";
import { capitalizeWords, formatNumber } from "../../../../util/converters";
import { selectedFiltersAtom } from "../atoms";
import { CultureFilter, CultureOrderType } from "../models";

export default function Culture() {
  const [cultures, setCultures] = useState<CultureFilter[]>([]);
  const [selectedFilters, setSelectedFilters] = useAtom(selectedFiltersAtom);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredCultures, setFilteredCultures] = useState<CultureFilter[]>([]);
  const [orderType, setOrderType] = useState<CultureOrderType>("objectCount-desc");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showSelectedOnly, setShowSelectedOnly] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getCultures = async (): Promise<CultureFilter[]> => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`proxy/culture?size=1000&sort=objectcount&sortorder=desc`);
      return response.data.records;
    } catch (error) {
      console.error("Failed to fetch cultures:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCultures = async () => {
      if (cultures.length === 0) {
        const fetchedCultures = await getCultures();
        setCultures(fetchedCultures);
      } else {
        setIsLoading(false);
      }
    };
    fetchCultures();
  }, [cultures]);

  useEffect(() => {
    let updatedCultures = [...cultures];

    if (searchTerm) {
      updatedCultures = updatedCultures.filter((culture) => {
        const cultureName = culture.name.toLowerCase();
        const term = searchTerm.toLowerCase();
        return cultureName.includes(term);
      });
    }

    if (showSelectedOnly) {
      updatedCultures = updatedCultures.filter((culture) =>
        selectedFilters.cultures.some((filter) => filter.id === culture.id)
      );

      if (updatedCultures.length === 0) {
        setShowSelectedOnly(false);
      }
    }

    updatedCultures.sort((a, b) => {
      switch (orderType) {
        case "alphabetical-asc":
          return a.name.localeCompare(b.name);
        case "alphabetical-desc":
          return b.name.localeCompare(a.name);
        case "objectCount-desc":
          return b.objectcount - a.objectcount;
        case "objectCount-asc":
          return a.objectcount - b.objectcount;
        default:
          return 0;
      }
    });

    setFilteredCultures(updatedCultures);
  }, [searchTerm, cultures, orderType, showSelectedOnly, selectedFilters]);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleOrderChange = (
    type: "alphabetical-asc" | "alphabetical-desc" | "objectCount-desc" | "objectCount-asc"
  ) => {
    setOrderType(type);
    setShowDropdown(false);
  };

  const handleSelectCulture = (cultureId: number) => {
    setSelectedFilters((prev) => ({
      ...prev,
      cultures: prev.cultures.some((filter) => filter.id === cultureId)
        ? prev.cultures.filter((filter) => filter.id !== cultureId)
        : [...prev.cultures, { id: cultureId, name: cultures.find((culture) => culture.id === cultureId)?.name || "" }]
    }));
  };

  return (
    <div className="flex flex-col text-white w-full transition-transform duration-200 ease-in-out">
      <h1 className="text-4xl font-bold mt-4 ml-4">Cultures</h1>

      {isLoading && cultures.length === 0 ? (
        <div className="self-center mt-8 flex flex-col items-center gap-2">
          <Loader2Icon size={80} className="animate-spin stroke-1" />
          <span className="text-sm">Searching Cultures</span>
        </div>
      ) : (
        <div className="flex flex-col w-full px-4">
          <div className="flex items-center gap-2 relative mt-6 mb-2">
            <input
              type="text"
              placeholder="Search culture..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-400 rounded-lg w-full"
            />

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

          {selectedFilters.cultures.length > 0 && (
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

          <div className="flex flex-col gap-3 my-4">
            {filteredCultures.length !== 0
              ? filteredCultures.map((culture) => (
                  <div
                    key={culture.id}
                    className={`flex items-end justify-between h-fit border-[1px] border-almost-white cursor-pointer bg-opacity-30 hover:scale-105 transition-transform duration-200 ease-in-out p-2 px-4 rounded-full ${
                      selectedFilters.cultures.map((filter) => filter.id).includes(culture.id)
                        ? "bg-almost-white bg-opacity-20"
                        : ""
                    }`}
                    onClick={() => handleSelectCulture(culture.id)}
                  >
                    <span className="text-md font-medium">{capitalizeWords(culture.name)}</span>
                    <span
                      className={`text-sm font-medium ${
                        selectedFilters.cultures.map((filter) => filter.id).includes(culture.id)
                          ? "text-almost-white"
                          : "text-silver-gray-lighter"
                      }`}
                      title={`${culture.objectcount} Objects`}
                    >
                      {formatNumber(culture.objectcount)}
                    </span>
                  </div>
                ))
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
        </div>
      )}
    </div>
  );
}
