import { IOrganizationPerson } from "../models/Organization";
import List from "../models/List";
import { isLoadAction } from "./LoadAction";
import { Action } from "redux";

const emptyOrganizationPerson: IOrganizationPerson = {
  id: 0,
  person_id: 0,
  organization_id: 0
};

export default function organizationPeopleReducer(
  state = new List<IOrganizationPerson>(emptyOrganizationPerson, []),
  action: Action
) {
  if (isLoadAction(action)) {
    return state
      .add(action.payload.organizationPeople)
      .remove(action.payload.deletedOrganizationPeople);
  }
  return state;
}
