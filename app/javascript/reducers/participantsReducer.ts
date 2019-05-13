import {
  ADD_PARTICIPANTS,
  DELETE_PARTICIPANT,
  ParticipantAction
} from "../actions/participantActions";
import { IParticipant } from "../models/Participant";
import List from "../models/List";

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
  switch (action.type) {
    case ADD_PARTICIPANTS:
      return state.add(action.participants!);
    case DELETE_PARTICIPANT:
      return state.remove(action.id!);
  }
  return state;
}
