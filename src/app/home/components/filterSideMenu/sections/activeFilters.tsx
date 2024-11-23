import { Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { negativeFiltersAtom, selectedFiltersAtom } from "../atoms";
import { useAtom } from "jotai";

export default function ActiveFilters() {
  const [isLoading] = useState<boolean>(false);
  const [selectedFilters] = useAtom(selectedFiltersAtom);
  const [negativeFilters] = useAtom(negativeFiltersAtom);

  return (
    <div className="flex flex-col gap-2 text-white w-[350px] transition-transform duration-200 ease-in-out">
      <h1 className="text-4xl text-center font-bold mt-4">Active Filters</h1>
      {isLoading ? (
        <div className="self-center mt-8 flex flex-col items-center gap-2">
          <Loader2Icon size={80} className="animate-spin stroke-1" />
          <span className="text-sm">Fetching filters</span>
        </div>
      ) : (
        <div className="flex flex-col w-full px-4">
          <p>Selected Filters: {JSON.stringify(selectedFilters)}</p>
          <p className="mt-10">Negative Filters: {JSON.stringify(negativeFilters)}</p>
          {/* <div className="flex items-center gap-2 relative mt-6 mb-2">
            <input
              type="text"
              placeholder="Search classification..."
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

          {(selectedFilters.classifications.length > 0 || negativeFilters.classifications.length > 0) && (
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
            {filteredClassifications.length !== 0
              ? filteredClassifications.map((classification) => (
                  <div
                    key={classification.id}
                    className={`flex items-end justify-between h-fit border-[1px] border-almost-white cursor-pointer bg-opacity-30 hover:scale-105 transition-transform duration-200 ease-in-out p-2 px-4 rounded-full ${
                      selectedFilters.classifications.includes(classification.id) ? "bg-almost-white bg-opacity-20" : ""
                    } ${
                      negativeFilters.classifications.includes(classification.id)
                        ? "bg-red-500 bg-opacity-40 border-red-600 ring-1 ring-red-600"
                        : ""
                    }`}
                    onClick={() => handleSelectClassification(classification.id)}
                    onAuxClick={() => handleNegativeSelectClassification(classification.id)}
                  >
                    <span className="text-md font-medium">{capitalizeWords(classification.name)}</span>
                    <span
                      className={`text-sm font-medium ${
                        selectedFilters.classifications.includes(classification.id) ||
                        negativeFilters.classifications.includes(classification.id)
                          ? "text-almost-white"
                          : "text-silver-gray-lighter"
                      }`}
                      title={`${classification.objectcount} Objects`}
                    >
                      {formatNumber(classification.objectcount)}
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
      )}*/}
        </div>
      )}
    </div>
  );
}
