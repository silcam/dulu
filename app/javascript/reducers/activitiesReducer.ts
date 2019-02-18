import {
  ADD_ACTIVITIES,
  SET_ACTIVITY,
  DELETE_WORKSHOP_EVENT,
  ActivityAction
} from "../actions/activityActions";
import { findIndexById } from "../util/arrayUtils";
import update from "immutability-helper";
import { IActivity } from "../models/TypeBucket";
import { stdReducersNoList } from "./stdReducers";

export interface ActivityState {
  [id: string]: IActivity | undefined;
}

const emptyActivity: IActivity = {
  id: 0,
  workshops: {}
};

const emptyState: ActivityState = {};

const stdActivitiesReducers = stdReducersNoList(emptyActivity);

export default function activitiesReducer(
  state = emptyState,
  action: ActivityAction
): ActivityState {
  switch (action.type) {
    case ADD_ACTIVITIES:
      return stdActivitiesReducers.addItems(state, action.activities!);
    case SET_ACTIVITY:
      return stdActivitiesReducers.addItems(state, [action.activity!]);
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
  state: ActivityState,
  { activityId, workshopId }: DeleteWSEventAction
) {
  if (state[activityId] && state[activityId]!.workshops) {
    const index = findIndexById(state[activityId]!.workshops, workshopId);
    if (index >= 0)
      return update(state, {
        [activityId]: { workshops: { [index]: { $unset: ["event_id"] } } }
      });
  }
  return state;
}
