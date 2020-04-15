import Activity, { IActivity } from "../models/Activity";
import List from "../models/List";
import { isLoadAction } from "./LoadAction";
import { Action } from "redux";

export const emptyActivity: IActivity = {
  id: 0,
  type: "TranslationActivity",
  language_id: 0,
  bible_book_id: 0,
  stage_name: "",
  stage_date: "",
  stages: [],
  title: "",
  category: "",
  workshops: [],
  participant_ids: [],
  can: {},
  film: "",
  scripture: "",
  bible_book_ids: []
};

export default function activitiesReducer(
  state = new List<IActivity>(emptyActivity, [], Activity.compare),
  action: Action
) {
  if (isLoadAction(action)) {
    return state.add(action.payload.activities);
  }
  return state;
}
