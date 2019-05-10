import {
  SET_PEOPLE,
  ADD_PERSON,
  SET_PERSON,
  DELETE_PERSON,
  ADD_PEOPLE,
  PeopleAction
} from "../actions/peopleActions";
import { personCompare, IPerson } from "../models/Person";
import { State } from "./stdReducers";
import List from "../models/List";
import { Locale } from "../i18n/i18n";

export const emptyPerson: IPerson = {
  id: 0,
  first_name: "",
  last_name: "",
  can: {},
  roles: [],
  email: "",
  ui_language: Locale.en,
  email_pref: "daily",
  participants: [], // TODO - remove
  grantable_roles: [],
  gender: "M"
};

export type PersonState = State<IPerson>;

export default function peopleReducer(
  state = new List<IPerson>(emptyPerson, [], personCompare),
  action: PeopleAction
) {
  switch (action.type) {
    case SET_PEOPLE:
      return state.addAndPrune(action.people!);
    case ADD_PEOPLE:
      return state.add(action.people!);
    case ADD_PERSON:
    case SET_PERSON:
      return state.add([action.person!]);
    case DELETE_PERSON:
      return state.remove(action.id!);
  }
  return state;
}
