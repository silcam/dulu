import {
  SET_PEOPLE,
  ADD_PERSON,
  SET_PERSON,
  DELETE_PERSON,
  ADD_PEOPLE,
  PeopleAction
} from "../actions/peopleActions";
import { personCompare, IPerson } from "../models/Person";
import { stdReducers } from "./stdReducers";

const emptyPerson = {
  id: 0,
  first_name: "",
  last_name: "",
  can: {},
  roles: [],
  email: "",
  ui_language: "",
  email_pref: "",
  participants: [] // TODO - remove
};

export interface PersonState {
  list: number[];
  byId: {
    [id: string]: IPerson | undefined;
  };
}

const emptyState: PersonState = {
  list: [],
  byId: {}
};

const stdPersonReducers = stdReducers(emptyPerson, personCompare);

export default function peopleReducer(
  state = emptyState,
  action: PeopleAction
) {
  switch (action.type) {
    case SET_PEOPLE:
      return stdPersonReducers.setList(state, action.people!);
    case ADD_PEOPLE:
      return stdPersonReducers.addItems(state, action.people!);
    case ADD_PERSON:
      return stdPersonReducers.addItems(state, [action.person!]);
    case SET_PERSON:
      return stdPersonReducers.addItems(state, [action.person!]);
    case DELETE_PERSON:
      return stdPersonReducers.deleteItem(state, action.id!);
  }
  return state;
}
