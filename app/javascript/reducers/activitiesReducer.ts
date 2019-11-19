import {
  ADD_ACTIVITIES,
  SET_ACTIVITY,
  DELETE_WORKSHOP_EVENT,
  ActivityAction
} from "../actions/activityActions";
import { findIndexById } from "../util/arrayUtils";
import update from "immutability-helper";
import Activity, { IActivity } from "../models/Activity";
import List from "../models/List";

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
  scripture: ""
};

export default function activitiesReducer(
  state = new List<IActivity>(emptyActivity, [], Activity.compare),
  action: ActivityAction
) {
  switch (action.type) {
    case ADD_ACTIVITIES:
      return state.add(action.activities!);
    case SET_ACTIVITY:
      return state.add([action.activity!]);
    case DELETE_WORKSHOP_EVENT:
      return deleteWorkshopEvent(state, action as DeleteWSEventAction);
  }
  return state;
}

interface DeleteWSEventAction {
  activityId: number;
  workshopId: number;
}
function deleteWorkshopEvent(
  state: List<IActivity>,
  { activityId, workshopId }: DeleteWSEventAction
) {
  const activity = state.get(activityId);
  if (activity.id > 0) {
    const index = findIndexById(activity.workshops, workshopId);
    if (index >= 0)
      return state.add([
        update(activity, { workshops: { [index]: { $unset: ["event_id"] } } })
      ]);
  }
  return state;
}
