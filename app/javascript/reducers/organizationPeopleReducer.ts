import {
  ADD_ORGANIZATION_PEOPLE,
  SET_ORGANIZATION_PERSON,
  DELETE_ORGANIZATION_PERSON,
  OrganizationPeopleAction
} from "../actions/organizationPeopleActions";
import { IOrganizationPerson } from "../models/TypeBucket";
import { stdReducersNoList } from "./stdReducers";

const emptyOrganizationPerson: IOrganizationPerson = {
  id: 0,
  person_id: 0,
  organization_id: 0
};

export interface OrganizationPeopleState {
  [id: string]: IOrganizationPerson | undefined;
}

const emptyState = {};

const stdOrganizationPersonReducers = stdReducersNoList(
  emptyOrganizationPerson
);

export default function organizationPeopleReducer(
  state = emptyState,
  action: OrganizationPeopleAction
) {
  switch (action.type) {
    case ADD_ORGANIZATION_PEOPLE:
      return stdOrganizationPersonReducers.addItems(
        state,
        action.organizationPeople!
      );
    case SET_ORGANIZATION_PERSON:
      return stdOrganizationPersonReducers.addItems(state, [
        action.organizationPerson!
      ]);
    case DELETE_ORGANIZATION_PERSON:
      return stdOrganizationPersonReducers.deleteItem(state, action.id!);
  }
  return state;
}
