export type FilterSection = {
  section: string;
  icon: JSX.Element;
  displayName: string;
  shouldRender?: boolean;
  divisionLine?: boolean;
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
  Person = "person",
  Culture = "culture"
}

export type SelectedFilters = {
  centuries: number[];
  classifications: number[];
  colors: string[];
  materials: number[];
  periods: number[];
  places: number[];
  techniques: number[];
  workTypes: number[];
  persons: number[];
  cultures: number[];
};

export type ColorFilter = {
  colorid: number;
  hex: string;
  id: number;
  lastupdate: string;
  name: string;
};

export type ClassificationOrderType = "alphabetical-asc" | "alphabetical-desc" | "objectCount-desc" | "objectCount-asc";

export type ClassificationFilter = {
  classificationid: number;
  id: number;
  lastupdate: string;
  name: string;
  objectcount: number;
};

export type WorkTypeOrderType = "alphabetical-asc" | "alphabetical-desc" | "objectCount-desc" | "objectCount-asc";

export type WorkTypeFilter = {
  objectcount: number;
  id: number;
  lastupdate: string;
  name: string;
  worktypeid: number;
};

export type MaterialOrderType = "alphabetical-asc" | "alphabetical-desc" | "objectCount-desc" | "objectCount-asc";

export type MaterialFilter = {
  pathforward: string;
  level: number;
  objectcount: number;
  parentmediumid: number | null;
  mediumid: number;
  name: string;
  id: number;
  lastupdate: string;
  haschildren: number;
};

export type CultureOrderType = "alphabetical-asc" | "alphabetical-desc" | "objectCount-desc" | "objectCount-asc";

export type CultureFilter = {
  objectcount: number;
  name: string;
  id: number;
  lastupdate: string;
};

export type CenturyOrderType =
  | "alphabetical-asc"
  | "alphabetical-desc"
  | "objectCount-desc"
  | "objectCount-asc"
  | "temporalOrder-asc"
  | "temporalOrder-desc";

export type CenturyFilter = {
  objectcount: number;
  name: string;
  id: number;
  lastupdate: string;
  temporalorder: number;
};

export type PeriodOrderType = "alphabetical-asc" | "alphabetical-desc" | "objectCount-desc" | "objectCount-asc";

export type PeriodFilter = {
  objectcount: number;
  name: string;
  id: number;
  lastupdate: string;
};

export type PlaceOrderType = "alphabetical-asc" | "alphabetical-desc" | "objectCount-desc" | "objectCount-asc";

export type PlaceFilter = {
  geo: {
    lon: number;
    lat: number;
  };
  pathforward: string;
  level: number;
  objectcount: number;
  parentplaceid: number | null;
  placeid: number;
  name: string;
  id: number;
  lastupdate: string;
  haschildren: number;
  tgn_id: number;
};

export type PersonOrderType = "alphabetical-asc" | "alphabetical-desc" | "objectCount-desc" | "objectCount-asc";

export type PersonFilter = {
  gender: string;
  displaydate: string;
  objectcount: number;
  roles: {
    role: string;
    context: string;
    frequency: number;
  }[];
  wikidata_id: string;
  dateend: number;
  url: string;
  viaf_id: string;
  names: {
    displayname: string;
    type: string;
  }[];
  birthplace: string;
  wikipedia_id: string;
  datebegin: number;
  culture: string;
  displayname: string;
  alphasort: string;
  ulan_id: string;
  personid: number;
  deathplace: string;
  id: number;
  lastupdate: string;
  lcnaf_id: string;
};

export type TechniqueOrderType = "alphabetical-asc" | "alphabetical-desc" | "objectCount-desc" | "objectCount-asc";

export type TechniqueFilter = {
  objectcount: number;
  id: number;
  lastupdate: string;
  name: string;
  techniqueid: number;
};

export enum ColorDisplayName {
  aliceblue = "Alice Blue",
  antiquewhite = "Antique White",
  aqua = "Aqua",
  aquamarine = "Aquamarine",
  azure = "Azure",
  beige = "Beige",
  bisque = "Bisque",
  black = "Black",
  blanchedalmond = "Blanched Almond",
  blue = "Blue",
  blueviolet = "Blue Violet",
  brown = "Brown",
  burlywood = "Burly Wood",
  cadetblue = "Cadet Blue",
  chartreuse = "Chartreuse",
  chocolate = "Chocolate",
  coral = "Coral",
  cornflowerblue = "Cornflower Blue",
  cornsilk = "Cornsilk",
  crimson = "Crimson",
  cyan = "Cyan",
  darkblue = "Dark Blue",
  darkcyan = "Dark Cyan",
  darkgoldenrod = "Dark Goldenrod",
  darkgray = "Dark Gray",
  darkgreen = "Dark Green",
  darkgrey = "Dark Grey",
  darkkhaki = "Dark Khaki",
  darkmagenta = "Dark Magenta",
  darkolivegreen = "Dark Olive Green",
  darkorange = "Dark Orange",
  darkorchid = "Dark Orchid",
  darkred = "Dark Red",
  darksalmon = "Dark Salmon",
  darkseagreen = "Dark Sea Green",
  darkslateblue = "Dark Slate Blue",
  darkslategray = "Dark Slate Gray",
  darkslategrey = "Dark Slate Grey",
  darkturquoise = "Dark Turquoise",
  darkviolet = "Dark Violet",
  deeppink = "Deep Pink",
  deepskyblue = "Deep Sky Blue",
  dimgray = "Dim Gray",
  dimgrey = "Dim Grey",
  dodgerblue = "Dodger Blue",
  firebrick = "Fire Brick",
  floralwhite = "Floral White",
  forestgreen = "Forest Green",
  fuchsia = "Fuchsia",
  gainsboro = "Gainsboro",
  ghostwhite = "Ghost White",
  gold = "Gold",
  goldenrod = "Goldenrod",
  gray = "Gray",
  green = "Green",
  greenyellow = "Green Yellow",
  grey = "Grey",
  honeydew = "Honeydew",
  hotpink = "Hot Pink",
  indianred = "Indian Red",
  indigo = "Indigo",
  ivory = "Ivory",
  khaki = "Khaki",
  lavender = "Lavender",
  lavenderblush = "Lavender Blush",
  lawngreen = "Lawn Green",
  lemonchiffon = "Lemon Chiffon",
  lightblue = "Light Blue",
  lightcoral = "Light Coral",
  lightcyan = "Light Cyan",
  lightgoldenrodyellow = "Light Goldenrod Yellow",
  lightgray = "Light Gray",
  lightgreen = "Light Green",
  lightgrey = "Light Grey",
  lightpink = "Light Pink",
  lightsalmon = "Light Salmon",
  lightseagreen = "Light Sea Green",
  lightskyblue = "Light Sky Blue",
  lightslategray = "Light Slate Gray",
  lightslategrey = "Light Slate Grey",
  lightsteelblue = "Light Steel Blue",
  lightyellow = "Light Yellow",
  lime = "Lime",
  limegreen = "Lime Green",
  linen = "Linen",
  magenta = "Magenta",
  maroon = "Maroon",
  mediumaquamarine = "Medium Aquamarine",
  mediumblue = "Medium Blue",
  mediumorchid = "Medium Orchid",
  mediumpurple = "Medium Purple",
  mediumseagreen = "Medium Sea Green",
  mediumslateblue = "Medium Slate Blue",
  mediumspringgreen = "Medium Spring Green",
  mediumturquoise = "Medium Turquoise",
  mediumvioletred = "Medium Violet Red",
  midnightblue = "Midnight Blue",
  mintcream = "Mint Cream",
  mistyrose = "Misty Rose",
  moccasin = "Moccasin",
  navajowhite = "Navajo White",
  navy = "Navy",
  oldlace = "Old Lace",
  olive = "Olive",
  olivedrab = "Olive Drab",
  orange = "Orange",
  orangered = "Orange Red",
  orchid = "Orchid",
  palegoldenrod = "Pale Goldenrod",
  palegreen = "Pale Green",
  paleturquoise = "Pale Turquoise",
  palevioletred = "Pale Violet Red",
  papayawhip = "Papaya Whip",
  peachpuff = "Peach Puff",
  peru = "Peru",
  pink = "Pink",
  plum = "Plum",
  powderblue = "Powder Blue",
  purple = "Purple",
  red = "Red",
  rosybrown = "Rosy Brown",
  royalblue = "Royal Blue",
  saddlebrown = "Saddle Brown",
  salmon = "Salmon",
  sandybrown = "Sandy Brown",
  seagreen = "Sea Green",
  seashell = "Seashell",
  sienna = "Sienna",
  silver = "Silver",
  skyblue = "Sky Blue",
  slateblue = "Slate Blue",
  slategray = "Slate Gray",
  slategrey = "Slate Grey",
  snow = "Snow",
  springgreen = "Spring Green",
  steelblue = "Steel Blue",
  tan = "Tan",
  teal = "Teal",
  thistle = "Thistle",
  tomato = "Tomato",
  turquoise = "Turquoise",
  violet = "Violet",
  wheat = "Wheat",
  white = "White",
  whitesmoke = "White Smoke",
  yellow = "Yellow",
  yellowgreen = "Yellow Green"
}
