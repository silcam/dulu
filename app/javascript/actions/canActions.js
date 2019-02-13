export const SET_EVENTS_CAN = "SET_EVENTS_CAN";

export function setEventsCan(can) {
  return {
    type: SET_EVENTS_CAN,
    can: can
  };
}
