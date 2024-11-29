import { useAtom } from "jotai";
import { X } from "lucide-react";
import { capitalizeWords } from "../../../../util/converters";
import { negativeFiltersAtom, selectedFiltersAtom } from "../atoms";
import { FilterSectionsEnum } from "../models";
import type { SelectedFilters } from "../models";

export default function ActiveFilters() {
  const [selectedFilters, setSelectedFilters] = useAtom(selectedFiltersAtom);
  const [negativeFilters, setNegativeFilters] = useAtom(negativeFiltersAtom);

  const handleSelectFilter = (filterId: number, type: FilterSectionsEnum) => {
    const updateFilters = (key: keyof SelectedFilters, isString = false) => {
      setSelectedFilters((prev) => ({
        ...prev,
        [key]: prev[key].some((item: any) => (isString ? item === filterId.toString() : item.id === filterId))
          ? prev[key].filter((item: any) => (isString ? item !== filterId.toString() : item.id !== filterId))
          : [
              ...prev[key],
              isString ? filterId.toString() : selectedFilters[key].find((item: any) => item.id === filterId)!
            ]
      }));

      setNegativeFilters((prev) => ({
        ...prev,
        [key]: prev[key].filter((item: any) => (isString ? item !== filterId.toString() : item.id !== filterId))
      }));
    };

    switch (type) {
      case FilterSectionsEnum.Classifications:
        updateFilters("classifications");
        break;
      case FilterSectionsEnum.Colors:
        updateFilters("colors", true);
        break;
      case FilterSectionsEnum.WorkType:
        updateFilters("workTypes");
        break;
      case FilterSectionsEnum.Materials:
        updateFilters("materials");
        break;
      case FilterSectionsEnum.Technique:
        updateFilters("techniques");
        break;
      case FilterSectionsEnum.Periods:
        updateFilters("periods");
        break;
      case FilterSectionsEnum.Century:
        updateFilters("centuries");
        break;
      case FilterSectionsEnum.Place:
        updateFilters("places");
        break;
      case FilterSectionsEnum.Person:
        updateFilters("persons");
        break;
      case FilterSectionsEnum.Culture:
        updateFilters("cultures");
        break;
      default:
        break;
    }
  };

  const handleNegativeSelect = (filterId: number, type: FilterSectionsEnum) => {
    const updateNegativeFilters = (key: keyof SelectedFilters, isString = false) => {
      setNegativeFilters((prev) => ({
        ...prev,
        [key]: prev[key].some((item: any) => (isString ? item === filterId.toString() : item.id === filterId))
          ? prev[key].filter((item: any) => (isString ? item !== filterId.toString() : item.id !== filterId))
          : [
              ...prev[key],
              isString ? filterId.toString() : selectedFilters[key].find((item: any) => item.id === filterId)!
            ]
      }));

      setSelectedFilters((prev) => ({
        ...prev,
        [key]: prev[key].filter((item: any) => (isString ? item !== filterId.toString() : item.id !== filterId))
      }));
    };

    switch (type) {
      case FilterSectionsEnum.Classifications:
        updateNegativeFilters("classifications");
        break;
      case FilterSectionsEnum.Colors:
        updateNegativeFilters("colors", true);
        break;
      case FilterSectionsEnum.WorkType:
        updateNegativeFilters("workTypes");
        break;
      case FilterSectionsEnum.Materials:
        updateNegativeFilters("materials");
        break;
      case FilterSectionsEnum.Technique:
        updateNegativeFilters("techniques");
        break;
      case FilterSectionsEnum.Periods:
        updateNegativeFilters("periods");
        break;
      case FilterSectionsEnum.Century:
        updateNegativeFilters("centuries");
        break;
      case FilterSectionsEnum.Place:
        updateNegativeFilters("places");
        break;
      case FilterSectionsEnum.Person:
        updateNegativeFilters("persons");
        break;
      case FilterSectionsEnum.Culture:
        updateNegativeFilters("cultures");
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col gap-2 text-white w-[350px] transition-transform duration-200 ease-in-out">
      <h1 className="text-4xl font-bold mt-4 ml-4">Active Filters</h1>

      <div className="flex flex-col w-full px-4">
        {[
          {
            title: "Classification",
            selectedFilters: selectedFilters.classifications,
            negativeFilters: negativeFilters.classifications,
            type: FilterSectionsEnum.Classifications
          },
          {
            title: "Work Type",
            selectedFilters: selectedFilters.workTypes,
            negativeFilters: negativeFilters.workTypes,
            type: FilterSectionsEnum.WorkType
          },
          {
            title: "Materials",
            selectedFilters: selectedFilters.materials,
            negativeFilters: negativeFilters.materials,
            type: FilterSectionsEnum.Materials
          },
          {
            title: "Techniques",
            selectedFilters: selectedFilters.techniques,
            negativeFilters: negativeFilters.techniques,
            type: FilterSectionsEnum.Technique
          },
          {
            title: "Periods",
            selectedFilters: selectedFilters.periods,
            negativeFilters: negativeFilters.periods,
            type: FilterSectionsEnum.Periods
          },
          {
            title: "Centuries",
            selectedFilters: selectedFilters.centuries,
            negativeFilters: negativeFilters.centuries,
            type: FilterSectionsEnum.Century
          },
          {
            title: "Cultures",
            selectedFilters: selectedFilters.cultures,
            negativeFilters: negativeFilters.cultures,
            type: FilterSectionsEnum.Culture
          },
          {
            title: "Places",
            selectedFilters: selectedFilters.places,
            negativeFilters: negativeFilters.places,
            type: FilterSectionsEnum.Place
          }
          // Adicione mais seções aqui conforme necessário
        ].map(({ title, selectedFilters, negativeFilters, type }) =>
          selectedFilters.length > 0 || negativeFilters.length > 0 ? (
            <div key={type} className="flex flex-col gap-3 my-4">
              <p className="text-2xl font-semibold">{title}</p>
              {selectedFilters
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((filter) => (
                  <div
                    key={filter.id}
                    className="flex items-center justify-between h-fit border-[1px] border-almost-white cursor-pointer bg-opacity-30 p-2 px-4 rounded-full bg-almost-white bg-opacity-20"
                    onAuxClick={() => handleNegativeSelect(filter.id, type)}
                  >
                    <span className="text-md font-medium">{capitalizeWords(filter.name)}</span>
                    <span
                      className={`text-sm font-medium ${
                        selectedFilters.map((f) => f.id).includes(filter.id) ||
                        negativeFilters.map((f) => f.id).includes(filter.id)
                          ? "text-almost-white"
                          : "text-silver-gray-lighter"
                      }`}
                    ></span>
                    <X size={24} className="text-almost-white" onClick={() => handleSelectFilter(filter.id, type)} />
                  </div>
                ))}
              {negativeFilters.length > 0 && <p className="text-lg">Negative Filters</p>}
              {negativeFilters.map((filter) => (
                <div
                  key={filter.id}
                  className="flex items-center justify-between h-fit border-[1px] border-almost-white cursor-pointer bg-opacity-30 p-2 px-4 rounded-full bg-red-500 bg-opacity-40 border-red-600 ring-1 ring-red-600"
                  onAuxClick={() => handleNegativeSelect(filter.id, type)}
                >
                  <span className="text-md font-medium">{capitalizeWords(filter.name)}</span>
                  <X size={24} className="text-almost-white" onClick={() => handleNegativeSelect(filter.id, type)} />
                </div>
              ))}
            </div>
          ) : null
        )}

        {/* <p>Selected Filters: {JSON.stringify(selectedFilters)}</p>
      <p className="mt-4">Negative Filters: {JSON.stringify(negativeFilters)}</p> */}
      </div>
    </div>
  );
}
