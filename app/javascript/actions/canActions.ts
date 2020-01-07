export const SET_CAN = "SET_CAN";

export interface ICan {
  create?: boolean;
  update?: boolean;
  destroy?: boolean;
  update_activities?: boolean;
  grant_login?: boolean;
}

export interface CanAction {
  type: string;
  key: string;
  can: ICan;
}

export function setCan(key: string, can: ICan) {
  return {
    type: SET_CAN,
    key,
    can
  };
}
