import { IPerson, fullName } from "./Person";
import { IOrganization } from "./Organization";
import { T } from "../i18n/i18n";
import BibleBook from "./BibleBook";
import List from "./List";
import { MediaFilm } from "./Activity";
import { max, sort } from "../util/arrayUtils";

export interface IDomainStatusItem {
  id: number;
  language_id: number;
  category: DSICategory;
  subcategory: DSISubcategories;
  description: string;
  title: string;
  year: number | null;
  link: string;
  dsiLocation?: DSILocation;
  platforms: string;
  organization_ids: number[];
  person_ids: number[];
  creator_id: number;
  bible_book_ids: number[];
  count: number;
  completeness: DSICompleteness;
  details: DSIDetails;
}

export interface DSILocation {
  id: number;
  name: string;
}

export const DSICategories = <const>[
  "PublishedScripture",
  "AudioScripture",
  "Film",
  "ScriptureApp",
  "Research",
  "DataCollection",
  "LiteracyMaterial"
  // "Community"
  // If you add a category, update domain_status_item.rb
];
export type DSICategory = typeof DSICategories[number];

export const ScripturePortions = <const>["Portions", "New_testament", "Bible"];
export type ScripturePortion = typeof ScripturePortions[number];

export const LingResearches = <const>[
  "Phonology",
  "Orthography",
  "Tone",
  "Grammar",
  "Discourse"
];
export type LingResearch = typeof LingResearches[number];

export const DataCollections = <const>["Lexicon", "Texts"];
export type DataCollection = typeof DataCollections[number];

export const LingCommunityItems = <const>["Workshops"];
export type LingCommunityItem = typeof LingCommunityItems[number];

export const LiteracyMaterials = <const>[
  "AlphabetChart",
  "AlphabetBook",
  "Primer_1",
  "Primer_2",
  "TransitionManual",
  "BibleStoryBook",
  "StoryBook",
  "InformationalBook"
];
export type LiteracyMaterial = typeof LiteracyMaterials[number];

export const InformationGenres = <const>["Agriculture", "Health", "Other"];
export type InformationGenre = typeof InformationGenres[number];

export type DSISubcategories =
  | MediaFilm
  | ScripturePortion
  | LingResearch
  | DataCollection
  | LingCommunityItem
  | LiteracyMaterial;

export const AppPlatforms = <const>["Android", "iOS"];
export type AppPlatform = typeof AppPlatforms[number];

export const DiscourseTypes = <const>[
  "Narrative",
  "Hortatory",
  "Expository",
  "Procedural"
];
export type DiscourseType = typeof DiscourseTypes[number];

export const GrammarTypes = <const>[
  "NounPhrase",
  "VerbPhrase",
  "ClausesAndSentences"
];
export type GrammarType = typeof GrammarTypes[number];

type DiscourseDetails = { [key in DiscourseType]?: number };

type GrammarTypeDetails = { [key in GrammarType]?: boolean };

export interface DSIDetails extends DiscourseDetails, GrammarTypeDetails {
  toneOrthography?: boolean;
  ddpWork?: boolean;
  informationGenre?: InformationGenre;
}

export const DSICompletenesses = <const>["Draft", "Satisfactory"];
export type DSICompleteness = typeof DSICompletenesses[number];

interface DSCategoryList {
  [key: string]: readonly DSISubcategories[];
}
const categoryList: DSCategoryList = {
  PublishedScripture: ScripturePortions,
  AudioScripture: ScripturePortions,
  Film: Object.values(MediaFilm),
  ScriptureApp: ScripturePortions,
  Research: LingResearches,
  DataCollection: DataCollections,
  LiteracyMaterial: LiteracyMaterials
  // Community: LingCommunityItems
};

function lingSubcategories() {
  return (DataCollections as readonly string[]).concat(LingResearches);
}

function platformsStr(android: boolean, ios: boolean) {
  return [android ? "Android" : false, ios ? "iOS" : false]
    .filter(p => !!p)
    .join("|");
}

function books(item: IDomainStatusItem, t: T, max?: number) {
  const ids = max ? item.bible_book_ids.slice(0, max) : item.bible_book_ids;
  let names = ids.map(id => BibleBook.name(id, t)).join("-");
  if (names.includes(" ")) names = names.replace(/-/g, ", ");
  if (ids.length < item.bible_book_ids.length) names += "...";
  return names;
}

export function countUnit(collectionType: DataCollection) {
  switch (collectionType) {
    case "Lexicon":
      return "words";
    case "Texts":
      return "texts";
  }
}

export function countText(item: IDomainStatusItem) {
  return item.count > 0 ? `${item.count}` : `?`;
}

export function latestItem(items: IDomainStatusItem[]) {
  return max(items, itemDateCompare);
}

export function sortByDate(items: IDomainStatusItem[]) {
  return sort(items, itemDateCompare);
}

export function revSortByDate(items: IDomainStatusItem[]) {
  return sort(items, (a, b) => itemDateCompare(b, a));
}

function itemDateCompare(a: IDomainStatusItem, b: IDomainStatusItem) {
  if (a.year && b.year && a.year != b.year) return a.year - b.year;
  return a.id - b.id;
}

export function lingCompleteSat(item: IDomainStatusItem) {
  return item.completeness == "Satisfactory";
}

function personNames(item: IDomainStatusItem, people: List<IPerson>): string[] {
  return item.person_ids.map(id => fullName(people.get(id)));
}

function orgNames(
  item: IDomainStatusItem,
  organizations: List<IOrganization>
): string[] {
  return item.organization_ids.map(id => organizations.get(id).short_name);
}

function empty(): IDomainStatusItem {
  return {
    id: 0,
    language_id: 0,
    category: "Research",
    subcategory: "Phonology",
    description: "",
    title: "",
    year: null,
    platforms: "",
    link: "",
    organization_ids: [],
    person_ids: [],
    creator_id: 0,
    bible_book_ids: [],
    count: 0,
    completeness: "Draft",
    details: {}
  };
}

function emptyList() {
  return new List(empty(), []);
}

export default {
  categoryList,
  platformsStr,
  books,
  personNames,
  orgNames,
  lingSubcategories,
  empty,
  emptyList
};
