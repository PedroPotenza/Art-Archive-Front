import { atom } from "jotai";
import {
  ColorFilter,
  ClassificationFilter,
  SelectedFilters,
  WorkTypeFilter,
  TechniqueFilter,
  PersonFilter,
  PlaceFilter,
  PeriodFilter,
  CenturyFilter,
  CultureFilter,
  MaterialFilter
} from "./models";

export const selectedFiltersAtom = atom<SelectedFilters>({
  centuries: [],
  classifications: [],
  colors: [],
  materials: [],
  periods: [],
  places: [],
  techniques: [],
  workTypes: [],
  persons: [],
  cultures: []
});

export const negativeFiltersAtom = atom<SelectedFilters>({
  centuries: [],
  classifications: [],
  colors: [],
  materials: [],
  periods: [],
  places: [],
  techniques: [],
  workTypes: [],
  persons: [],
  cultures: []
});

export const isFilterOpenAtom = atom(false);

export const colorsAtom = atom<ColorFilter[]>([]);

export const classificationsAtom = atom<ClassificationFilter[]>([]);

export const workTypesAtom = atom<WorkTypeFilter[]>([]);

export const techniquesAtom = atom<TechniqueFilter[]>([]);

export const personsAtom = atom<PersonFilter[]>([]);

export const placesAtom = atom<PlaceFilter[]>([]);

export const periodsAtom = atom<PeriodFilter[]>([]);

export const centuriesAtom = atom<CenturyFilter[]>([]);

export const culturesAtom = atom<CultureFilter[]>([]);

export const materialsAtom = atom<MaterialFilter[]>([]);
