import { IParticipant } from "../models/Participant";
import List from "../models/List";
import { isLoadAction } from "./LoadAction";
import { Action } from "redux";

export const emptyParticipant: IParticipant = {
  id: 0,
  person_id: 0,
  roles: [],
  start_date: "",
  can: {}
};

export default function participantsReducer(
  state = new List<IParticipant>(emptyParticipant, []),
  action: Action
) {
  if (isLoadAction(action)) {
    return state
      .add(action.payload.participants)
      .remove(action.payload.deletedParticipants);
  }
  return state;
}
