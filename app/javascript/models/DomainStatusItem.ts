import { ById } from "./TypeBucket";
import { IPerson, fullName } from "./Person";
import ifDef from "../util/ifDef";
import { IOrganization } from "./Organization";
import { T } from "../i18n/i18n";
import BibleBook from "./BibleBook";

export interface IDomainStatusItem {
  id: number;
  language_id: number;
  category: DSICategories;
  subcategory: DSISubcategories;
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

export const enum DSISubcategories {
  Portions = "Portions",
  NewTestament = "New_testament",
  Bible = "Bible",
  JesusFilm = "JesusFilm",
  LukeFilm = "LukeFilm",
  ActsFilm = "ActsFilm",
  GenesisFilm = "GenesisFilm",
  StoryOfGenesisFilm = "StoryOfGenesisFilm",
  BookOfJohn = "BookOfJohn",
  MagdalenaFilm = "MagdalenaFilm"
}

export enum AppPlatforms {
  Android = "Android",
  iOS = "iOS"
}

interface DSCategoryList {
  [key: string]: DSISubcategories[];
}
const categoryList: DSCategoryList = {
  [DSICategories.PublishedScripture]: [
    DSISubcategories.Portions,
    DSISubcategories.NewTestament,
    DSISubcategories.Bible
  ],
  [DSICategories.AudioScripture]: [
    DSISubcategories.Portions,
    DSISubcategories.NewTestament,
    DSISubcategories.Bible
  ],
  [DSICategories.Film]: [
    DSISubcategories.JesusFilm,
    DSISubcategories.LukeFilm,
    DSISubcategories.ActsFilm,
    DSISubcategories.GenesisFilm,
    DSISubcategories.StoryOfGenesisFilm,
    DSISubcategories.BookOfJohn,
    DSISubcategories.MagdalenaFilm
  ],
  [DSICategories.ScriptureApp]: [
    DSISubcategories.Portions,
    DSISubcategories.NewTestament,
    DSISubcategories.Bible
  ]
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

function books(item: IDomainStatusItem, t: T) {
  return item.bible_book_ids.map(id => BibleBook.name(id, t)).join("-");
}

function personName(item: IDomainStatusItem, people: ById<IPerson>) {
  return ifDef(item.person_id, id =>
    ifDef(people[id], person => fullName(person))
  );
}

function orgName(item: IDomainStatusItem, organizations: ById<IOrganization>) {
  return ifDef(item.organization_id, id =>
    ifDef(organizations[id], org => org.short_name)
  );
}

export default {
  categoryList,
  platformsStr,
  books,
  personName,
  orgName
};
