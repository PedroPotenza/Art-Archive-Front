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

import { FilterSection, FilterSectionsEnum } from "./models";
import React from "react";

export const FilterSections: FilterSection[] = [
  {
    section: FilterSectionsEnum.ActiveFilters,
    icon: <Blend size={32} />,
    displayName: "Active Filters",
    shouldRender: true,
    sectionContent: (
      <div className="flex flex-col gap-2 text-white w-[350px] transition-transform duration-200 ease-in-out">
        <h1 className="text-4xl text-center font-bold mt-4">Example</h1>
        <p>example 1</p>
      </div>
    )
  },
  {
    section: FilterSectionsEnum.ExcludedFilters,
    icon: <CircleOff size={32} />,
    displayName: "Excluded Filters",
    shouldRender: true,
    divisionLine: true
  },
  {
    section: FilterSectionsEnum.Colors,
    icon: <Palette size={32} />,
    displayName: "Colors",
    shouldRender: true
  },
  {
    section: FilterSectionsEnum.Classifications,
    icon: <Tag size={32} />,
    displayName: "Classifications",
    shouldRender: true
  },
  {
    section: FilterSectionsEnum.WorkType,
    icon: <SquarePen size={32} />,
    displayName: "Work Type",
    shouldRender: true
  },
  {
    section: FilterSectionsEnum.Materials,
    icon: <PencilRuler size={32} />,
    displayName: "Materials",
    shouldRender: true
  },
  {
    section: FilterSectionsEnum.Technique,
    icon: <Brush size={32} />,
    displayName: "Technique",
    shouldRender: true
  },
  {
    section: FilterSectionsEnum.Periods,
    icon: <Calendar size={32} />,
    displayName: "Periods",
    shouldRender: true
  },
  {
    section: FilterSectionsEnum.Century,
    icon: <Hourglass size={32} />,
    displayName: "Century",
    shouldRender: true
  },
  {
    section: FilterSectionsEnum.Place,
    icon: <MapPinned size={32} />,
    displayName: "Place",
    shouldRender: true
  },
  {
    section: FilterSectionsEnum.Person,
    icon: <SquareUserRound size={32} />,
    displayName: "Person",
    shouldRender: true
  }
];
