import { SET_EVENTS_CAN } from "../actions/canActions";
import update from "immutability-helper";

const emptyState = {
  events: {}
};

export default function canReducer(state = emptyState, action) {
  switch (action.type) {
    case SET_EVENTS_CAN:
      return update(state, { events: { $set: action.can } });
  }
  return state;
}
