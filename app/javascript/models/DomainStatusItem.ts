import { IPerson, fullName } from "./Person";
import ifDef from "../util/ifDef";
import { IOrganization } from "./Organization";
import { T } from "../i18n/i18n";
import BibleBook from "./BibleBook";
import List from "./List";
import { MediaFilm } from "./Activity";

export interface IDomainStatusItem {
  id: number;
  language_id: number;
  category: DSICategories;
  subcategory: DSISubcategories;
  description: string;
  year: number | null;
  platforms: string;
  organization_id: number | null;
  person_id: number | null;
  creator_id: number;
  bible_book_ids: number[];
}

export enum DSICategories {
  PublishedScripture = "PublishedScripture",
  AudioScripture = "AudioScripture",
  Film = "Film",
  ScriptureApp = "ScriptureApp"
}

export enum ScripturePortion {
  Portions = "Portions",
  NewTestament = "New_testament",
  Bible = "Bible"
}

export type DSISubcategories = MediaFilm | ScripturePortion;

export enum AppPlatforms {
  Android = "Android",
  iOS = "iOS"
}

interface DSCategoryList {
  [key: string]: DSISubcategories[];
}
const categoryList: DSCategoryList = {
  [DSICategories.PublishedScripture]: Object.values(ScripturePortion),
  [DSICategories.AudioScripture]: Object.values(ScripturePortion),
  [DSICategories.Film]: Object.values(MediaFilm),
  [DSICategories.ScriptureApp]: Object.values(ScripturePortion)
};

// interface DSITree {
//   [category: string]: {
//     [subcategory: string]: IDomainStatusItem[];
//   };
// }
// const emptyDSITree = Object.values(DSICategories).reduce(
//   (accum, category) => ({
//     ...accum,
//     [category]: categoryList[category].reduce(
//       (subAccum, subcategory) => ({
//         ...subAccum,
//         [subcategory]: []
//       }),
//       {}
//     )
//   }),
//   {}
// );

// function categorize(domainStatusItems: IDomainStatusItem[]): DSITree {
//   return domainStatusItems.reduce(
//     (accum, item) =>
//       update(accum, {
//         [item.category]: { [item.subcategory]: { $push: item } }
//       }),
//     emptyDSITree
//   );
// }

function platformsStr(android: boolean, ios: boolean) {
  return [
    android ? AppPlatforms.Android : false,
    ios ? AppPlatforms.iOS : false
  ]
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

export default {
  categoryList,
  platformsStr,
  books,
  personName,
  orgName
};
