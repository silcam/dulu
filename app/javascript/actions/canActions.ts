export const SET_EVENTS_CAN = "SET_EVENTS_CAN";

export interface ICan {
  create?: boolean;
  update?: boolean;
}

export interface CanAction {
  type: string;
  can: ICan;
}

export function setEventsCan(can: ICan) {
  return {
    type: SET_EVENTS_CAN,
    can: can
  };
}
