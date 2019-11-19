import Colors from "../util/Colors";
import BibleBook from "./BibleBook";
import { itemAfter } from "../util/arrayUtils";
import FuzzyDate from "../util/FuzzyDate";
import { IWorkshop } from "./Workshop";
import { ICan } from "../actions/canActions";
import { T } from "../i18n/i18n";
import List from "./List";

export interface IActivity {
  id: number;
  type: "TranslationActivity" | "MediaActivity" | "LinguisticActivity";
  language_id: number;
  stage_name: string;
  stage_date: string;
  stages: IStage[];
  bible_book_id: number;
  title: string;
  category: string;
  workshops: IWorkshop[];
  can: ICan;
  participant_ids: number[];
  film: string;
  scripture: string;
  bible_book_ids: number[];
}

export interface IStage {
  id: number;
  name: string;
  start_date: string;
  activity_id: number;
  invalidDate?: boolean;
}

export type ActivityType = "Translation" | "Media" | "Research" | "Workshops";

interface IProgress {
  percent: number;
  color: string;
}
export interface ProgressContainer {
  [stage: string]: IProgress;
}

export enum MediaCategory {
  AudioScripture = "AudioScripture",
  Film = "Film"
}

export enum MediaFilm {
  JesusFilm = "JesusFilm",
  LukeFilm = "LukeFilm",
  ActsFilm = "ActsFilm",
  GenesisFilm = "GenesisFilm",
  StoryOfGenesisFilm = "StoryOfGenesisFilm",
  BookOfJohn = "BookOfJohn",
  MagdalenaFilm = "MagdalenaFilm",
  LumoMatthew = "LumoMatthew",
  LumoMark = "LumoMark",
  LumoLuke = "LumoLuke",
  LumoJohn = "LumoJohn"
}

export enum MediaScripture {
  Bible = "Bible",
  Old_testament = "Old_testament",
  New_testament = "New_testament",
  Other = "Other"
}

const mediaCategories = Object.values(MediaCategory);
const mediaFilms = Object.values(MediaFilm);
const mediaScriptures = Object.values(MediaScripture);

const mediaProgress: ProgressContainer = {
  Planned: { percent: 0, color: Colors.white },
  Application: { percent: 20, color: Colors.red },
  Script: { percent: 40, color: Colors.orange },
  Scheduled: { percent: 50, color: Colors.yellow },
  Recording: { percent: 60, color: Colors.light_green },
  Mastering: { percent: 80, color: Colors.light_blue },
  Published: { percent: 100, color: Colors.purple }
};
const researchProgress: ProgressContainer = {
  Planned: { percent: 0, color: Colors.white },
  Research: { percent: 25, color: Colors.red },
  Drafting: { percent: 50, color: Colors.yellow },
  Review: { percent: 75, color: Colors.light_blue },
  Published: { percent: 100, color: Colors.purple }
};
const translationProgress: ProgressContainer = {
  Planned: { percent: 0, color: Colors.white },
  Drafting: { percent: 10, color: Colors.red },
  Testing: { percent: 20, color: Colors.orange },
  Review_committee: { percent: 40, color: Colors.pale_orange },
  Back_translating: { percent: 60, color: Colors.yellow },
  Prechecking: { percent: 70, color: Colors.light_green },
  Ready_for_consultant_check: { percent: 75, color: Colors.dark_green },
  Consultant_check: { percent: 80, color: Colors.light_blue },
  Consultant_checked: { percent: 90, color: Colors.dark_blue },
  Ready_for_publication: { percent: 95, color: Colors.light_purple },
  Published: { percent: 100, color: Colors.purple }
};

function availableBooks(translation_activities: List<IActivity>, t: T) {
  return BibleBook.books(t).filter(
    book =>
      !translation_activities.some(
        activity => activity.bible_book_id == book.id
      )
  );
}

function nextStage(activity: IActivity): IStage {
  return {
    id: 0,
    name: itemAfter(stages(activity), activity.stage_name) || "",
    start_date: FuzzyDate.today(),
    activity_id: activity.id
  };
}

function name(activity: IActivity, t: T) {
  switch (activity.type) {
    case "LinguisticActivity":
      return activity.title;
    case "MediaActivity":
      return activity.category == "Film"
        ? t(activity.film)
        : activity.scripture == "Other"
        ? t("AudioScripture")
        : t("Audio_x", { x: t(activity.scripture) });
    case "TranslationActivity":
      return BibleBook.name(activity.bible_book_id, t);
  }
}

function matchesType(activity: IActivity, type: ActivityType) {
  // Translation or Media
  if (activity.type.startsWith(type)) return true;
  // Research or Workshops
  if (activity.category == type) return true;

  return false;
}

function progress(activity: IActivity) {
  switch (activity.type) {
    case "LinguisticActivity":
      return activity.category == "Research"
        ? researchProgress[activity.stage_name]
        : workshopsProgress(activity);
    case "MediaActivity":
      return mediaProgress[activity.stage_name];
    case "TranslationActivity":
      return translationProgress[activity.stage_name];
  }
}

function workshopsProgress(activity: IActivity) {
  const percent =
    (100 * activity.workshops.filter(ws => ws.completed).length) /
    activity.workshops.length;
  const color = percent == 100 ? Colors.purple : Colors.yellow;
  return {
    percent: percent,
    color: color
  };
}

function stages(activity: IActivity) {
  switch (activity.type) {
    case "LinguisticActivity":
      return activity.category == "Research"
        ? Object.keys(researchProgress)
        : workshopsStages(activity);
    case "MediaActivity":
      return Object.keys(mediaProgress);
    case "TranslationActivity":
      return Object.keys(translationProgress);
  }
}

function workshopsStages(activity: IActivity) {
  return activity.workshops.map(ws => ws.name);
}

function currentStageName(activity: IActivity, t: T) {
  return isWorkshops(activity)
    ? workshopsCurrentStageName(activity, t)
    : t(`stage_names.${activity.stage_name}`);
}

function workshopsCurrentStageName(activity: IActivity, t: T) {
  const firstIncomplete = activity.workshops.find(ws => !ws.completed);
  return firstIncomplete ? firstIncomplete.name : t("Completed");
}

function isWorkshops(activity: IActivity) {
  return (
    activity.type == "LinguisticActivity" && activity.category == "Workshops"
  );
}

function stageDate(activity: IActivity) {
  return isWorkshops(activity)
    ? workshopsStageDate(activity)
    : activity.stage_date;
}

function workshopsStageDate(activity: IActivity) {
  const firstIncomplete = activity.workshops.find(ws => !ws.completed);
  return firstIncomplete ? firstIncomplete.date : "";
}

// Activities may be different types!
function compare(a: IActivity, b: IActivity) {
  const domainCompare = a.type.localeCompare(b.type);
  if (domainCompare != 0) return domainCompare;

  if (a.type == "TranslationActivity") {
    return a.bible_book_id - b.bible_book_id;
  }

  if (a.type == "LinguisticActivity") {
    const categoryCompare = a.category.localeCompare(b.category);
    if (categoryCompare != 0) return categoryCompare;
  }
  const closeEnoughT = (key: string) => key;
  return name(a, closeEnoughT).localeCompare(name(b, closeEnoughT));
}

export default {
  translationProgress,
  mediaCategories,
  mediaFilms,
  mediaScriptures,

  availableBooks,
  nextStage,
  name,
  matchesType,
  progress,
  stages,
  currentStageName,
  isWorkshops,
  stageDate,
  compare
};
