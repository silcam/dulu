import { Locale } from "../i18n/i18n";
import { ViewPrefs } from "./useViewPrefs";

export interface User {
  ui_language: Locale;
  view_prefs: ViewPrefs;
  id: number;
  first_name: string;
  last_name: string;
}

function blankUser(): User {
  return {
    ui_language: Locale.en,
    view_prefs: {},
    id: 0,
    first_name: "",
    last_name: ""
  };
}

export default function currentUserReducer(
  state = blankUser(),
  action: CurrentUserAction
) {
  if (action.type == "SET_CURRENT_USER") {
    return { ...state, ...action.payload.user };
  }
  return state;
}

export function setCurrentUserAction(user: Partial<User>) {
  return {
    type: "SET_CURRENT_USER",
    payload: { user }
  };
}
export type CurrentUserAction = ReturnType<typeof setCurrentUserAction>;
