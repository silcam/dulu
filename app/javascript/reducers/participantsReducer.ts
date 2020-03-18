import {
  ADD_PARTICIPANTS,
  DELETE_PARTICIPANT,
  ParticipantAction
} from "../actions/participantActions";
import { IParticipant } from "../models/Participant";
import List from "../models/List";
import { isLoadAction } from "./LoadAction";

export const emptyParticipant: IParticipant = {
  id: 0,
  person_id: 0,
  roles: [],
  start_date: "",
  can: {}
};

export default function participantsReducer(
  state = new List<IParticipant>(emptyParticipant, []),
  action: ParticipantAction
) {
  if (isLoadAction(action)) {
    return state
      .add(action.payload.participants)
      .remove(action.payload.deletedParticipants);
  }
  switch (action.type) {
    case ADD_PARTICIPANTS:
      return state.add(action.participants!);
    case DELETE_PARTICIPANT:
      return state.remove(action.id!);
  }
  return state;
}
