import { atom } from "jotai";
import { ColorFilter, ClassificationFilter, SelectedFilters } from "./models";

export const selectedFiltersAtom = atom<SelectedFilters>({
  centuries: [],
  classifications: [],
  colors: [],
  materials: [],
  periods: [],
  places: [],
  techniques: [],
  workTypes: [],
  persons: []
});

export const excludedFiltersAtom = atom("Japan");

export const isFilterOpenAtom = atom(false);

export const colorsAtom = atom<ColorFilter[]>([]);

export const classificationsAtom = atom<ClassificationFilter[]>([]);
