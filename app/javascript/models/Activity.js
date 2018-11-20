import Colors from "../util/Colors";
import BibleBook from "./BibleBook";

export default class Activity {
  static availableBooks(translation_activities, t) {
    return BibleBook.books(t).filter(
      book =>
        !translation_activities.some(
          activity => activity.bible_book_id == book.id
        )
    );
  }
}

Activity.translationStages = [
  "Planned",
  "Drafting",
  "Testing",
  "Review_committee",
  "Back_translating",
  "Ready_for_consultant_check",
  "Consultant_check",
  "Consultant_checked",
  "Published"
];

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
