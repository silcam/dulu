import Colors from "../util/Colors";
import BibleBook from "./BibleBook";
import { itemAfter, findById } from "../util/arrayUtils";
import FuzzyDate from "../util/FuzzyDate";

export default class Activity {
  static availableBooks(translation_activities, t) {
    return BibleBook.books(t).filter(
      book =>
        !translation_activities.some(
          activity => activity.bible_book_id == book.id
        )
    );
  }

  static nextStage(activity) {
    return {
      name: itemAfter(Activity.stages(activity), activity.stage_name),
      start_date: FuzzyDate.today(),
      activity_id: activity.id
    };
  }

  static name(activity, t) {
    switch (activity.type) {
      case "LinguisticActivity":
        return activity.title;
      case "MediaActivity":
        return activity.name;
      case "TranslationActivity":
        return BibleBook.name(activity.bible_book_id, t);
    }
  }

  static progress(activity) {
    switch (activity.type) {
      case "LinguisticActivity":
        return activity.category == "Research"
          ? Activity.researchProgress[activity.stage_name]
          : Activity.workshopsProgress(activity);
      case "MediaActivity":
        return Activity.mediaProgress[activity.stage_name];
      case "TranslationActivity":
        return Activity.translationProgress[activity.stage_name];
    }
  }

  static workshopsProgress(activity) {
    const percent =
      (100 * activity.workshops.filter(ws => ws.completed).length) /
      activity.workshops.length;
    const color = percent == 100 ? Colors.purple : Colors.yellow;
    return {
      percent: percent,
      color: color
    };
  }

  static stages(activity) {
    switch (activity.type) {
      case "LinguisticActivity":
        return activity.category == "Research"
          ? Object.keys(Activity.researchProgress)
          : Activity.workshopsStages(activity);
      case "MediaActivity":
        return Object.keys(Activity.mediaProgress);
      case "TranslationActivity":
        return Object.keys(Activity.translationProgress);
    }
  }

  static workshopsStages(activity) {
    return activity.workshops.map(ws => ws.name);
  }

  static currentStageName(activity, t) {
    return Activity.isWorkshops(activity)
      ? Activity.workshopsCurrentStageName(activity, t)
      : t(`stage_names.${activity.stage_name}`);
  }

  static workshopsCurrentStageName(activity, t) {
    const firstIncomplete = activity.workshops.find(ws => !ws.completed);
    return firstIncomplete ? firstIncomplete.name : t("Completed");
  }

  static isWorkshops(activity) {
    return (
      activity.type == "LinguisticActivity" && activity.category == "Workshops"
    );
  }

  static stageDate(activity) {
    return Activity.isWorkshops(activity)
      ? Activity.workshopsStageDate(activity)
      : activity.stage_date;
  }

  static workshopsStageDate(activity) {
    const firstIncomplete = activity.workshops.find(ws => !ws.completed);
    return firstIncomplete ? firstIncomplete.date : "";
  }

  static findActivity(language, id) {
    const types = [
      "translation_activities",
      "media_activities",
      "research_activities",
      "workshops_activities"
    ];
    for (let i = 0; i < types.length; ++i) {
      let activity = findById(language[types[i]], id);
      if (activity) return activity;
    }
    return undefined;
  }

  // Activities may be different types!
  static compare(a, b) {
    const domainCompare = a.type.localeCompare(b.type);
    if (domainCompare != 0) return domainCompare;

    if (a.type == "TranslationActivity") {
      return a.bible_book_id - b.bible_book_id;
    }

    if (a.type == "LinguisticActivity") {
      const categoryCompare = a.category.localeCompare(b.category);
      if (categoryCompare != 0) return categoryCompare;
    }

    return Activity.name(a).localeCompare(Activity.name(b));
  }
}

Activity.mediaCategories = ["AudioScripture", "Film"];

Activity.mediaFilms = [
  "JesusFilm",
  "LukeFilm",
  "ActsFilm",
  "GenesisFilm",
  "StoryOfGenesisFilm",
  "BookOfJohn",
  "MagdalenaFilm"
];

Activity.mediaScriptures = ["Bible", "Old_testament", "New_testament", "Other"];

Activity.mediaProgress = {
  Planned: { percent: 0, color: Colors.white },
  Application: { percent: 20, color: Colors.red },
  Script: { percent: 40, color: Colors.orange },
  Scheduled: { percent: 50, color: Colors.yellow },
  Recording: { percent: 60, color: Colors.light_green },
  Mastering: { percent: 80, color: Colors.light_blue },
  Published: { percent: 100, color: Colors.purple }
};

Activity.researchProgress = {
  Planned: { percent: 0, color: Colors.white },
  Research: { percent: 25, color: Colors.red },
  Drafting: { percent: 50, color: Colors.yellow },
  Review: { percent: 75, color: Colors.light_blue },
  Published: { percent: 100, color: Colors.purple }
};

Activity.translationProgress = {
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
