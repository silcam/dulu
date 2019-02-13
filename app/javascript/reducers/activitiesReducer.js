import { addItemsNoList, setItemNoList } from "./reducerUtil";
import {
  ADD_ACTIVITIES,
  SET_ACTIVITY,
  DELETE_WORKSHOP_EVENT
} from "../actions/activityActions";
import { findIndexById } from "../util/arrayUtils";
import update from "immutability-helper";

const emptyState = {};

export default function activitiesReducer(state = emptyState, action) {
  switch (action.type) {
    case ADD_ACTIVITIES:
      return addItemsNoList(state, action.activities);
    case SET_ACTIVITY:
      return setItemNoList(state, action.activity);
    case DELETE_WORKSHOP_EVENT:
      return deleteWorkshopEvent(state, action);
  }
  return state;
}

function deleteWorkshopEvent(state, { activityId, workshopId }) {
  if (state[activityId] && state[activityId].workshops) {
    const index = findIndexById(state[activityId].workshops, workshopId);
    if (index >= 0)
      return update(state, {
        [activityId]: { workshops: { [index]: { $unset: ["event_id"] } } }
      });
  }
  return state;
}
