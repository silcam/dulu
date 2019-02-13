export const ADD_PARTICIPANTS = "ADD_PARTICIPANTS";
export const DELETE_PARTICIPANT = "DELETE_PARTICIPANT";

export function addParticipants(participants) {
  return {
    type: ADD_PARTICIPANTS,
    participants: participants
  };
}

export function deleteParticipant(id) {
  return {
    type: DELETE_PARTICIPANT,
    id
  };
}
