import { IParticipant } from "../models/TypeBucket";

export const ADD_PARTICIPANTS = "ADD_PARTICIPANTS";
export const DELETE_PARTICIPANT = "DELETE_PARTICIPANT";

export interface ParticipantAction {
  type: string;
  participants?: IParticipant[];
  id?: number;
}

export function addParticipants(
  participants: IParticipant[]
): ParticipantAction {
  return {
    type: ADD_PARTICIPANTS,
    participants: participants
  };
}

export function deleteParticipant(id: number): ParticipantAction {
  return {
    type: DELETE_PARTICIPANT,
    id
  };
}
