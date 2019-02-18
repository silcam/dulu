import intCompare from "./intCompare";
// import { IActivity } from "../models/TypeBucket";

// interface SortOptions {
//   option: string;
//   asc?: boolean;
// }

// interface SortFunction<T> {
//   (a: T, b: T): number;
// }

function sortActivities(sort, activities, sortFunctions) {
  activities.sort(sortFunctions[sort.option.toLowerCase()]);
  if (!sort.asc) activities.reverse();
  return activities;
}

function languageSort(a, b) {
  return a.language_name.localeCompare(b.language_name);
}

function stageSort(a, b) {
  return intCompare(a.progress.percent, b.progress.percent);
}

function lastUpdateSort(a, b) {
  return a.last_update.localeCompare(b.last_update);
}

function nameSort(a, b) {
  return a.name.localeCompare(b.name);
}

export { sortActivities, languageSort, stageSort, lastUpdateSort, nameSort };
