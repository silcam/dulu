import {
  SET_PEOPLE,
  ADD_PERSON,
  SET_PERSON,
  DELETE_PERSON,
  ADD_PEOPLE
} from "../actions/peopleActions";
import { personCompare } from "../models/Person";
import { setList, addItem, setItem, deleteItem, addItems } from "./reducerUtil";

const emptyState = {
  list: [],
  byId: {}
};

export default function peopleReducer(state = emptyState, action) {
  switch (action.type) {
    case SET_PEOPLE:
      return setList(state, action.people);
    case ADD_PEOPLE:
      return addItems(state, action.people, personCompare);
    case ADD_PERSON:
      return addItem(state, action.person, personCompare);
    case SET_PERSON:
      return setItem(state, action.person, personCompare);
    case DELETE_PERSON:
      return deleteItem(state, action.id);
  }
  return state;
}
