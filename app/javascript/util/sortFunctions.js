import intCompare from "./intCompare";

function sortActivities(sort, activities, sortFunctions) {
  activities.sort(sortFunctions[sort.option.toLowerCase()]);
  if (!sort.asc) activities.reverse();
  return activities;
}

function languageSort(a, b) {
  return a.program_name.localeCompare(b.program_name);
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
