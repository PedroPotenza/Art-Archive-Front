import { useAtom } from "jotai";
import { ArrowDown01, ArrowDown10, ArrowDownAZ, ArrowDownZA, Loader2Icon, PackageOpen } from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../../libs/axios/axios";
import { capitalizeWords, formatNumber } from "../../../../util/converters";
import { materialsAtom, selectedFiltersAtom } from "../atoms";
import { MaterialFilter, MaterialOrderType } from "../models";

export default function Material() {
  const [materials, setMaterials] = useAtom<MaterialFilter[]>(materialsAtom);
  const [selectedFilters, setSelectedFilters] = useAtom(selectedFiltersAtom);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredMaterials, setFilteredMaterials] = useState<MaterialFilter[]>([]);
  const [orderType, setOrderType] = useState<MaterialOrderType>("objectCount-desc");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showSelectedOnly, setShowSelectedOnly] = useState<boolean>(false);
  const [expandedParents, setExpandedParents] = useState<number[]>([]); // Estado para armazenar os materiais pais expandidos
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getMaterials = async (): Promise<MaterialFilter[]> => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`proxy/medium?size=1000&sort=objectcount&sortorder=desc`);
      return response.data.records;
    } catch (error) {
      console.error("Failed to fetch materials:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchMaterials = async () => {
      if (materials.length === 0) {
        const fetchedMaterials = await getMaterials();
        setMaterials(fetchedMaterials);
      } else {
        setIsLoading(false);
      }
    };
    fetchMaterials();
  }, [materials, setMaterials]);

  useEffect(() => {
    let updatedMaterials = [...materials];

    if (searchTerm) {
      updatedMaterials = updatedMaterials.filter((material) => {
        const materialName = material.name?.toLowerCase() || "";
        const term = searchTerm.toLowerCase();
        return materialName.includes(term);
      });
    }

    if (showSelectedOnly) {
      updatedMaterials = updatedMaterials.filter((material) => selectedFilters.materials.includes(material.id));

      if (updatedMaterials.length === 0) {
        setShowSelectedOnly(false);
      }
    }

    updatedMaterials.sort((a, b) => {
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

    setFilteredMaterials(updatedMaterials);
  }, [searchTerm, materials, orderType, showSelectedOnly, selectedFilters]);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleOrderChange = (
    type: "alphabetical-asc" | "alphabetical-desc" | "objectCount-desc" | "objectCount-asc"
  ) => {
    setOrderType(type);
    setShowDropdown(false);
  };

  const handleSelectMaterial = (materialId: number) => {
    console.log("materialId", materialId);
    setSelectedFilters((prev) => ({
      ...prev,
      materials: prev.materials.includes(materialId)
        ? prev.materials.filter((id) => id !== materialId)
        : [...prev.materials, materialId]
    }));
  };

  const toggleExpandMaterial = (materialId: number) => {
    console.log("materialId", materialId);
    setExpandedParents((prev) =>
      prev.includes(materialId) ? prev.filter((id) => id !== materialId) : [...prev, materialId]
    );
  };

  const renderMaterials = (materials: MaterialFilter[], parentId: number | null, level: number) => {
    return materials
      .filter((material) => material.parentmediumid === parentId)
      .map((material) => (
        <div key={material.id} className="flex flex-col">
          <div
            className={`flex flex-col border-[1px] border-almost-white bg-opacity-30 p-2 px-4 mb-3 ${
              expandedParents.includes(material.id)
                ? `rounded-3xl justify-center ${
                    level === 0 ? "bg-silver-gray" : level === 1 ? "bg-silver-gray-darker" : "bg-silver-gray-darkest"
                  }`
                : "rounded-full"
            }`}
          >
            <div
              className={`flex items-center justify-between cursor-pointer bg-opacity-30 hover:scale-105 transition-transform duration-200 ease-in-out
                ${expandedParents.includes(material.id) ? "mb-3" : "hover:scale-105"}
              ${selectedFilters.materials.includes(material.id) ? "bg-almost-white bg-opacity-20" : ""} `}
              onClick={() => handleSelectMaterial(material.id)}
              // style={{ marginLeft: `${level * 32}px` }}
            >
              <div className="flex items-center gap-2">
                <span className="text-md font-medium">{capitalizeWords(material.name)}</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium ${
                    selectedFilters.materials.includes(material.id) ? "text-almost-white" : "text-silver-gray-lighter"
                  }`}
                  title={`${material.objectcount} Objects`}
                >
                  {formatNumber(material.objectcount)}
                </span>
              </div>
            </div>

            {expandedParents.includes(material.id) && renderMaterials(materials, material.id, level + 1)}

            {material.haschildren &&
            expandedParents.includes(material.id) &&
            materials.some((child) => child.parentmediumid === material.id) ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpandMaterial(material.id);
                }}
                className="bg-transparent hover:bg-transparent p-0 border-0 w-fit h-fit focus:outline-none mb-3"
                // style={{ marginLeft: `${(level + 1) * 16}px` }}
              >
                <p>See less</p>
              </button>
            ) : null}
          </div>
          {material.haschildren &&
          !expandedParents.includes(material.id) &&
          materials.some((child) => child.parentmediumid === material.id) ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpandMaterial(material.id);
              }}
              className="bg-transparent hover:bg-transparent p-0 border-0 w-fit h-fit focus:outline-none mt-[-12px] mb-3"
              // style={{ marginLeft: `${(level + 1) * 16}px` }}
            >
              <p>See more</p>
            </button>
          ) : (
            <div className="w-5" />
          )}
        </div>
      ));
  };

  return (
    <div className="flex flex-col text-white w-full transition-transform duration-200 ease-in-out">
      <h1 className="text-4xl font-bold mt-4 ml-4">Materials</h1>

      {isLoading && materials.length === 0 ? (
        <div className="self-center mt-8 flex flex-col items-center gap-2">
          <Loader2Icon size={80} className="animate-spin stroke-1" />
          <span className="text-sm">Searching Materials</span>
        </div>
      ) : (
        <div className="flex flex-col w-full px-4">
          <div className="flex items-center gap-2 relative mt-6 mb-2">
            <input
              type="text"
              placeholder="Search material..."
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

          {selectedFilters.materials.length > 0 && (
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

          <div className="flex flex-col my-4">
            {filteredMaterials.length !== 0
              ? renderMaterials(filteredMaterials, null, 0)
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
