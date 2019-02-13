import {
  ADD_ORGANIZATION_PEOPLE,
  SET_ORGANIZATION_PERSON,
  DELETE_ORGANIZATION_PERSON
} from "../actions/organizationPeopleActions";
import update from "immutability-helper";
import { addItemsNoList, setItemNoList } from "./reducerUtil";

const emptyState = {};

export default function organizationPeopleReducer(state = emptyState, action) {
  switch (action.type) {
    case ADD_ORGANIZATION_PEOPLE:
      return addItemsNoList(state, action.organizationPeople);
    case SET_ORGANIZATION_PERSON:
      return setItemNoList(state, action.organizationPerson);
    case DELETE_ORGANIZATION_PERSON:
      return update(state, { $unset: [action.id] });
  }
  return state;
}
