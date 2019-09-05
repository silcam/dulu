import { IPerson, fullName } from "./Person";
import ifDef from "../util/ifDef";
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
  platforms: string;
  organization_id: number | null;
  person_id: number | null;
  creator_id: number;
  bible_book_ids: number[];
  count: number;
  completeness: DSICompleteness;
  details: DSIDetails;
}

export const DSICategories = <const>[
  "PublishedScripture",
  "AudioScripture",
  "Film",
  "ScriptureApp",
  "Research",
  "DataCollection"
  // "Community"
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

export type DSISubcategories =
  | MediaFilm
  | ScripturePortion
  | LingResearch
  | DataCollection
  | LingCommunityItem;

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
  DataCollection: DataCollections
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

function personName(item: IDomainStatusItem, people: List<IPerson>) {
  return ifDef(item.person_id, id =>
    ifDef(people.get(id), person => fullName(person))
  );
}

function orgName(item: IDomainStatusItem, organizations: List<IOrganization>) {
  return ifDef(item.organization_id, id =>
    ifDef(organizations.get(id), org => org.short_name)
  );
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
    organization_id: null,
    person_id: null,
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
  personName,
  orgName,
  lingSubcategories,
  empty,
  emptyList
};
