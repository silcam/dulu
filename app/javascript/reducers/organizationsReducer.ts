import {
  SET_ORGANIZATIONS,
  ADD_ORGANIZATION,
  SET_ORGANIZATION,
  DELETE_ORGANIZATION,
  ADD_ORGANIZATIONS,
  OrganizationAction
} from "../actions/organizationActions";
import Organization, { IOrganization } from "../models/Organization";
import List from "../models/List";

export const emptyOrganization: IOrganization = {
  id: 0,
  short_name: "",
  long_name: "",
  description: "",
  parent_id: null,
  country: null,
  can: {}
};

export default function organizationsReducer(
  state = new List<IOrganization>(emptyOrganization, [], Organization.compare),
  action: OrganizationAction
) {
  switch (action.type) {
    case SET_ORGANIZATIONS:
      return state.addAndPrune(action.organizations!);
    case ADD_ORGANIZATIONS:
      return state.add(action.organizations!);
    case ADD_ORGANIZATION:
    case SET_ORGANIZATION:
      return state.add([action.organization!]);
    case DELETE_ORGANIZATION:
      return state.remove(action.id!);
  }
  return state;
}
