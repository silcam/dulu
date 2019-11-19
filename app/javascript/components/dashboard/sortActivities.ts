import { IActivity } from "../../models/Activity";
import Language, { ILanguage } from "../../models/Language";
import baseCompare from "../../util/baseCompare";
import intCompare from "../../util/intCompare";
import Activity from "../../models/Activity";
import List from "../../models/List";
import { T } from "../../i18n/i18n";

export type SortOption = "Language" | "Book" | "Media" | "Stage";

export interface Sort {
  option: SortOption;
  desc?: boolean;
}

export default function sortActivities(
  sort: Sort,
  activities: IActivity[],
  languages: List<ILanguage>,
  t: T
) {
  let compare: (a: IActivity, b: IActivity) => number;
  switch (sort.option) {
    case "Book":
      compare = (a, b) => intCompare(a.bible_book_id, b.bible_book_id);
      break;
    case "Stage":
      compare = (a, b) =>
        intCompare(Activity.progress(a).percent, Activity.progress(b).percent);
      break;
    case "Media":
      compare = (a, b) => baseCompare(Activity.name(a, t), Activity.name(b, t));
      break;
    case "Language":
    default:
      compare = (a, b) =>
        Language.compare(
          languages.get(a.language_id),
          languages.get(b.language_id)
        );
  }

  const finalCompare = (a: IActivity, b: IActivity) =>
    sort.desc ? compare(b, a) : compare(a, b);

  return activities.sort(finalCompare);
}
