import { SET_CAN, CanAction, ICan } from "../actions/canActions";
import update from "immutability-helper";

export interface CanState {
  events: ICan;
  people: ICan;
  languages: ICan;
  organizations: ICan;
  clusters: ICan;
  regions: ICan;
}

const emptyState = {
  events: {},
  people: {},
  languages: {},
  organizations: {},
  clusters: {},
  regions: {}
};

export default function canReducer(
  state = emptyState,
  action: CanAction
): CanState {
  switch (action.type) {
    case SET_CAN:
      return update(state, { [action.key]: { $set: action.can } });
  }
  return state;
}
