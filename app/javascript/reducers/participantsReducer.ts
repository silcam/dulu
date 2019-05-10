import {
  ADD_PARTICIPANTS,
  DELETE_PARTICIPANT,
  ParticipantAction
} from "../actions/participantActions";
import { IParticipant } from "../models/Participant";
import { stdReducersNoList } from "./stdReducers";

const emptyParticipant: IParticipant = {
  id: 0,
  person_id: 0,
  roles: [],
  start_date: "",
  can: {}
};

export interface ParticipantState {
  [id: string]: IParticipant | undefined;
}

const emptyState = {};

const stdParticipantReducers = stdReducersNoList(emptyParticipant);

export default function participantsReducer(
  state = emptyState,
  action: ParticipantAction
) {
  switch (action.type) {
    case ADD_PARTICIPANTS:
      return stdParticipantReducers.addItems(state, action.participants!);
    case DELETE_PARTICIPANT:
      return stdParticipantReducers.deleteItem(state, action.id!);
  }
  return state;
}
