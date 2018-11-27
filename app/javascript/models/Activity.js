import Colors from "../util/Colors";
import BibleBook from "./BibleBook";
import { itemAfter } from "../util/arrayUtils";
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
      case "MediaActivity":
        return activity.name;
      case "TranslationActivity":
        return BibleBook.name(activity.bible_book_id, t);
    }
  }

  static progress(activity) {
    switch (activity.type) {
      case "MediaActivity":
        return Activity.mediaProgress[activity.stage_name];
      case "TranslationActivity":
        return Activity.translationProgress[activity.stage_name];
    }
  }

  static stages(activity) {
    switch (activity.type) {
      case "MediaActivity":
        return Object.keys(Activity.mediaProgress);
      case "TranslationActivity":
        return Object.keys(Activity.translationProgress);
    }
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

Activity.translationProgress = {
  Planned: { percent: 0, color: Colors.white },
  Drafting: { percent: 10, color: Colors.red },
  Testing: { percent: 20, color: Colors.orange },
  Review_committee: { percent: 40, color: Colors.yellow },
  Back_translating: { percent: 60, color: Colors.light_green },
  Ready_for_consultant_check: { percent: 75, color: Colors.dark_green },
  Consultant_check: { percent: 80, color: Colors.light_blue },
  Consultant_checked: { percent: 95, color: Colors.dark_blue },
  Published: { percent: 100, color: Colors.purple }
};
