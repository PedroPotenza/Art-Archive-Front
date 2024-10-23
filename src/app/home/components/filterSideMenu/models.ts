export type FilterSection = {
  section: string;
  icon: JSX.Element;
  displayName: string;
  shouldRender?: boolean;
  divisionLine?: boolean;
  sectionContent: JSX.Element;
};

export enum FilterSectionsEnum {
  ActiveFilters = "activeFilters",
  ExcludedFilters = "excludedFilters",
  Colors = "colors",
  Classifications = "classifications",
  WorkType = "workType",
  Materials = "materials",
  Technique = "technique",
  Periods = "periods",
  Century = "century",
  Place = "place",
  Person = "person"
}
