import {
  ADD_ORGANIZATION_PEOPLE,
  SET_ORGANIZATION_PERSON,
  DELETE_ORGANIZATION_PERSON,
  OrganizationPeopleAction
} from "../actions/organizationPeopleActions";
import { IOrganizationPerson } from "../models/Organization";
import List from "../models/List";

const emptyOrganizationPerson: IOrganizationPerson = {
  id: 0,
  person_id: 0,
  organization_id: 0
};

export default function organizationPeopleReducer(
  state = new List<IOrganizationPerson>(emptyOrganizationPerson, []),
  action: OrganizationPeopleAction
) {
  switch (action.type) {
    case ADD_ORGANIZATION_PEOPLE:
      return state.add(action.organizationPeople!);
    case SET_ORGANIZATION_PERSON:
      return state.add([action.organizationPerson!]);
    case DELETE_ORGANIZATION_PERSON:
      return state.remove(action.id!);
  }
  return state;
}
