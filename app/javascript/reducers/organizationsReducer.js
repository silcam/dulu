import {
  SET_ORGANIZATIONS,
  ADD_ORGANIZATION,
  SET_ORGANIZATION,
  DELETE_ORGANIZATION,
  ADD_ORGANIZATIONS
} from "../actions/organizationActions";
import { setList, addItem, setItem, deleteItem, addItems } from "./reducerUtil";
import { organizationCompare } from "../models/organization";

const emptyState = {
  list: [],
  byId: {}
};

export default function organizationsReducer(state = emptyState, action) {
  switch (action.type) {
    case SET_ORGANIZATIONS:
      return setList(state, action.organizations);
    case ADD_ORGANIZATIONS:
      return addItems(state, action.organizations, organizationCompare);
    case ADD_ORGANIZATION:
      return addItem(state, action.organization, organizationCompare);
    case SET_ORGANIZATION:
      return setItem(state, action.organization, organizationCompare);
    case DELETE_ORGANIZATION:
      return deleteItem(state, action.id);
  }
  return state;
}
