import { useAtom } from "jotai";
import { ArrowDown01, ArrowDown10, ArrowDownAZ, ArrowDownZA, Loader2Icon, PackageOpen } from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../../libs/axios/axios";
import { capitalizeWords, formatNumber } from "../../../../util/converters";
import { selectedFiltersAtom, techniquesAtom } from "../atoms";
import { TechniqueFilter, TechniqueOrderType } from "../models";

export default function Technique() {
  const [techniques, setTechniques] = useAtom(techniquesAtom);
  const [selectedFilters, setSelectedFilters] = useAtom(selectedFiltersAtom);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredTechniques, setFilteredTechniques] = useState<TechniqueFilter[]>([]);
  const [orderType, setOrderType] = useState<TechniqueOrderType>("objectCount-desc");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showSelectedOnly, setShowSelectedOnly] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getTechniques = async (): Promise<TechniqueFilter[]> => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`proxy/technique?size=1000&sort=objectcount&sortorder=desc`);
      return response.data.records;
    } catch (error) {
      console.error("Failed to fetch techniques:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchTechniques = async () => {
      if (techniques.length === 0) {
        const fetchedTechniques = await getTechniques();
        setTechniques(fetchedTechniques);
      } else {
        setIsLoading(false);
      }
    };
    fetchTechniques();
  }, [techniques]);

  useEffect(() => {
    let updatedTechniques = [...techniques];

    if (searchTerm) {
      updatedTechniques = updatedTechniques.filter((technique) => {
        const techniqueName = technique.name.toLowerCase();
        const term = searchTerm.toLowerCase();
        return techniqueName.includes(term);
      });
    }

    if (showSelectedOnly) {
      updatedTechniques = updatedTechniques.filter((technique) => selectedFilters.techniques.includes(technique.id));

      if (updatedTechniques.length === 0) {
        setShowSelectedOnly(false);
      }
    }

    updatedTechniques.sort((a, b) => {
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

    setFilteredTechniques(updatedTechniques);
  }, [searchTerm, techniques, orderType, showSelectedOnly, selectedFilters]);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleOrderChange = (
    type: "alphabetical-asc" | "alphabetical-desc" | "objectCount-desc" | "objectCount-asc"
  ) => {
    setOrderType(type);
    setShowDropdown(false);
  };

  const handleSelectTechnique = (techniqueId: number) => {
    setSelectedFilters((prev) => ({
      ...prev,
      techniques: prev.techniques.includes(techniqueId)
        ? prev.techniques.filter((id) => id !== techniqueId)
        : [...prev.techniques, techniqueId]
    }));
  };

  return (
    <div className="flex flex-col text-white w-full transition-transform duration-200 ease-in-out">
      <h1 className="text-4xl font-bold mt-4 ml-4">Techniques</h1>

      {isLoading && techniques.length === 0 ? (
        <div className="self-center mt-8 flex flex-col items-center gap-2">
          <Loader2Icon size={80} className="animate-spin stroke-1" />
          <span className="text-sm">Searching Techniques</span>
        </div>
      ) : (
        <div className="flex flex-col w-full px-4">
          <div className="flex items-center gap-2 relative mt-6 mb-2">
            <input
              type="text"
              placeholder="Search technique..."
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
                    className={`p-2 bg-sweet-gray-light hover:bg-sweet-gray-lighter cursor-pointer ${
                      orderType === "objectCount-desc" ? "bg-sweet-gray-lighter" : ""
                    }`}
                    onClick={() => handleOrderChange("objectCount-desc")}
                  >
                    Object Count (Higher First)
                  </li>
                  <li
                    className={`p-2 bg-sweet-gray-light hover:bg-sweet-gray-lighter cursor-pointer ${
                      orderType === "objectCount-asc" ? "bg-sweet-gray-lighter" : ""
                    }`}
                    onClick={() => handleOrderChange("objectCount-asc")}
                  >
                    Object Count (Lower First)
                  </li>
                  <li
                    className={`p-2 bg-sweet-gray-light hover:bg-sweet-gray-lighter cursor-pointer ${
                      orderType === "alphabetical-asc" ? "bg-sweet-gray-lighter" : ""
                    }`}
                    onClick={() => handleOrderChange("alphabetical-asc")}
                  >
                    Alphabetical (A - Z)
                  </li>
                  <li
                    className={`p-2 bg-sweet-gray-light hover:bg-sweet-gray-lighter cursor-pointer ${
                      orderType === "alphabetical-desc" ? "bg-sweet-gray-lighter" : ""
                    }`}
                    onClick={() => handleOrderChange("alphabetical-desc")}
                  >
                    Alphabetical (Z - A)
                  </li>
                </ul>
              </div>
            )}
          </div>

          {selectedFilters.techniques.length > 0 && (
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

          <div className="flex flex-col gap-3 mt-4">
            {filteredTechniques.length !== 0
              ? filteredTechniques.map((technique) => (
                  <div
                    key={technique.id}
                    className={`flex items-end justify-between h-fit border-[1px] border-almost-white cursor-pointer bg-opacity-30 hover:scale-105 transition-transform duration-200 ease-in-out p-2 px-4 rounded-full ${
                      selectedFilters.techniques.includes(technique.id) ? "bg-almost-white bg-opacity-20" : ""
                    }`}
                    onClick={() => handleSelectTechnique(technique.id)}
                  >
                    <span className="text-md font-medium">{capitalizeWords(technique.name)}</span>
                    <span
                      className={`text-sm font-medium ${
                        selectedFilters.techniques.includes(technique.id)
                          ? "text-almost-white"
                          : "text-sweet-gray-lighter"
                      }`}
                      title={`${technique.objectcount} Objects`}
                    >
                      {formatNumber(technique.objectcount)}
                    </span>
                  </div>
                ))
              : searchTerm !== "" && (
                  <div className="self-center flex flex-col items-center text-center max-w-[70%] ">
                    <PackageOpen size={64} className="stroke-1 text-sweet-gray-lighter mb-4" />
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
