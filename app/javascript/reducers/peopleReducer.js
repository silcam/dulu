import {
  SET_PEOPLE,
  ADD_PERSON,
  SET_PERSON,
  DELETE_PERSON
} from "../actions/peopleActions";
import { personCompare } from "../models/person";
import { setList, addItem, setItem, deleteItem } from "./reducerUtil";

const emptyState = {
  list: [],
  byId: {}
};

export default function peopleReducer(state = emptyState, action) {
  switch (action.type) {
    case SET_PEOPLE:
      return setList(state, action.people);
    case ADD_PERSON:
      return addItem(state, action.person, personCompare);
    case SET_PERSON:
      return setItem(state, action.person, personCompare);
    case DELETE_PERSON:
      return deleteItem(state, action.id);
  }
  return state;
}
