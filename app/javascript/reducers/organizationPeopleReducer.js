import {
  ADD_ORGANIZATION_PEOPLE,
  SET_ORGANIZATION_PERSON,
  DELETE_ORGANIZATION_PERSON
} from "../actions/organizationPeopleActions";
import update from "immutability-helper";
import mergeOrSet from "../util/mergeOrSet";

const emptyState = {};

export default function organizationPeopleReducer(state = emptyState, action) {
  switch (action.type) {
    case ADD_ORGANIZATION_PEOPLE:
      return action.organizationPeople.reduce(
        (accumState, orgPerson) =>
          update(accumState, { [orgPerson.id]: mergeOrSet(orgPerson) }),
        state
      );
    case SET_ORGANIZATION_PERSON:
      return update(state, {
        [action.organizationPerson.id]: mergeOrSet(action.organizationPerson)
      });
    case DELETE_ORGANIZATION_PERSON:
      return update(state, { $unset: [action.id] });
  }
  return state;
}
