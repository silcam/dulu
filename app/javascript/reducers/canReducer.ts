import { SET_EVENTS_CAN, CanAction } from "../actions/canActions";
import update from "immutability-helper";

export interface CanState {
  events: { create?: boolean };
}

const emptyState = {
  events: {}
};

export default function canReducer(
  state = emptyState,
  action: CanAction
): CanState {
  switch (action.type) {
    case SET_EVENTS_CAN:
      return update(state, { events: { $set: action.can } });
  }
  return state;
}
