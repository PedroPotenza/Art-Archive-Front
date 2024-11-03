export type Record = {
  accessionmethod: string;
  accessionyear: number;
  accesslevel: number;
  century: string;
  classification: string;
  classificationid: number;
  colorcount: number;
  colors: {
    color: string;
    css3: string;
    hue: string;
    percent: number;
    spectrum: string;
  }[];
  commentary: string;
  contact: string;
  contextualtextcount: number;
  creditline: string;
  culture: string;
  datebegin: number;
  dated: string;
  dateend: number;
  dateoffirstpageview: string;
  dateoflastpageview: string;
  department: string;
  description: string;
  dimensions: string;
  division: string;
  edition: string;
  exhibitioncount: number;
  groupcount: number;
  id: number;
  imagecount: number;
  imagepermissionlevel: number;
  images: {
    alttext: string;
    baseimageurl: string;
    copyright: string;
    date: string;
    description: string;
    displayorder: number;
    format: string;
    height: number;
    idsid: number;
    iiifbaseuri: string;
    imageid: number;
    publiccaption: string;
    renditionnumber: string;
    technique: string;
    width: number;
  }[];
  labeltext: string;
  lastupdate: string;
  lendingpermissionlevel: number;
  markscount: number;
  mediacount: number;
  medium: string;
  objectid: number;
  objectnumber: string;
  people: {
    alphasort: string;
    birthplace: string;
    culture: string;
    deathplace: string;
    displaydate: string;
    displayname: string;
    displayorder: number;
    gender: string;
    name: string;
    personid: number;
    prefix: string;
    role: string;
  }[];
  peoplecount: number;
  period: string;
  periodid: number;
  primaryimageurl: string;
  provenance: string;
  publicationcount: number;
  rank: number;
  relatedcount: number;
  seeAlso: {
    format: string;
    id: string;
    profile: string;
    type: string;
  }[];
  signed: string;
  standardreferencenumber: string;
  state: string;
  style: string;
  technique: string;
  techniqueid: number;
  title: string;
  titlescount: number;
  totalpageviews: number;
  totaluniquepageviews: number;
  url: string;
  verificationlevel: number;
  verificationleveldescription: string;
  worktypes: {
    worktype: string;
    worktypeid: string;
  }[];
  isInverted?: boolean;
};

export type HomepageRequest = {
  info: {
    next: string;
    page: number;
    pages: number;
    responsetime: string;
    totalrecords: number;
    totalrecordsperquery: number;
  };
  records: Record[];
};

export interface RecordDetails {
  accessionmethod?: string;
  accessionyear?: number;
  accesslevel?: number;
  century?: string;
  classification?: string;
  classificationid?: number;
  colorcount?: number;
  colors: Color[];
  commentary?: string;
  contact?: string;
  contextualtext?: ContextualText[];
  contextualtextcount?: number;
  copyright?: string;
  creditline?: string;
  culture?: string;
  datebegin?: number;
  dated?: string;
  dateend?: number;
  dateoffirstpageview?: string;
  dateoflastpageview?: string;
  department?: string;
  description?: string;
  details?: Details;
  dimensions?: string;
  division?: string;
  edition?: string;
  exhibitioncount?: number;
  exhibitions?: Exhibition[];
  gallery?: Gallery;
  groupcount?: number;
  groupings?: Grouping[];
  id?: number;
  imagecount?: number;
  imagepermissionlevel?: number;
  images: ImageDetails[];
  labeltext?: string;
  lastupdate?: string;
  lendingpermissionlevel?: number;
  markscount?: number;
  mediacount?: number;
  medium?: string;
  objectid?: number;
  objectnumber?: string;
  peoplecount: number;
  people?: Person[];
  period?: string;
  periodid?: number;
  places?: Place[];
  primaryimageurl?: string;
  provenance?: string;
  publicationcount?: number;
  publications?: Publication[];
  rank?: number;
  relatedcount?: number;
  seeAlso?: SeeAlso[];
  signed?: string;
  standardreferencenumber?: string;
  state?: string;
  style?: string;
  technique?: string;
  techniqueid?: number;
  terms?: Terms;
  title: string;
  titles?: Title[];
  titlescount?: number;
  totalpageviews?: number;
  totaluniquepageviews?: number;
  url?: string;
  verificationlevel: number;
  verificationleveldescription: string;
  worktypes?: WorkType[];
}

interface Person {
  alphasort?: string;
  birthplace?: string;
  culture?: string;
  deathplace?: string;
  displaydate?: string;
  displayname?: string;
  displayorder?: number;
  gender?: string;
  name?: string;
  personid?: number;
  prefix?: string;
  role?: string;
}

interface Color {
  color: string;
  css3: string;
  hue: string;
  percent: number;
  spectrum: string;
}

interface ContextualText {
  context?: string;
  date?: string;
  text?: string;
  textiletext?: string;
  type?: string;
}

interface Details {
  technical?: TechnicalDetail[];
}

interface TechnicalDetail {
  formattedtext?: string;
  text?: string;
  type?: string;
}

interface Exhibition {
  begindate?: string;
  citation?: string;
  enddate?: string;
  exhibitionid?: number;
  title?: string;
}

interface Gallery {
  begindate?: string;
  donorname?: string;
  floor?: string;
  galleryid?: string;
  gallerynumber?: string;
  name?: string;
  theme?: string;
}

interface Grouping {
  groupid?: number;
  name?: string;
}

export interface ImageDetails {
  alttext: string;
  baseimageurl: string;
  copyright: string;
  date: string;
  description: string;
  displayorder: number;
  format: string;
  height: number;
  idsid: number;
  iiifbaseuri: string;
  imageid: number;
  publiccaption: string;
  renditionnumber: string;
  technique: string;
  width: number;
}

interface Place {
  confidence?: number;
  displayname?: string;
  placeid?: number;
  type?: string;
}

interface Publication {
  citation?: string;
  citationremarks?: string;
  format?: string;
  pagenumbers?: string;
  publicationdate?: string;
  publicationid?: number;
  publicationplace?: string;
  publicationyear?: number;
  title?: string;
  volumenumber?: string;
  volumetitle?: string;
}

interface SeeAlso {
  format?: string;
  id?: string;
  profile?: string;
  type?: string;
}

interface Terms {
  century?: Term[];
  culture?: Term[];
  medium?: Term[];
  place?: Term[];
  topic?: Term[];
}

interface Term {
  id?: number;
  name?: string;
}

interface Title {
  displayorder?: number;
  title?: string;
  titleid?: number;
  titletype?: string;
}

interface WorkType {
  worktype?: string;
  worktypeid?: string;
}
