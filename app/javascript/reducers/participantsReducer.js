import {
  ADD_PARTICIPANTS,
  DELETE_PARTICIPANT
} from "../actions/participantActions";
import { addItemsNoList } from "./reducerUtil";
import update from "immutability-helper";

const emptyState = {};

export default function participantsReducer(state = emptyState, action) {
  switch (action.type) {
    case ADD_PARTICIPANTS:
      return addItemsNoList(state, action.participants);
    case DELETE_PARTICIPANT:
      return update(state, { $unset: [action.id] });
  }
  return state;
}
