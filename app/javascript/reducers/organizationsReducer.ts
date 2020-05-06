import Organization, { IOrganization } from "../models/Organization";
import List from "../models/List";
import { isLoadAction } from "./LoadAction";
import { Action } from "redux";

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
  action: Action
) {
  if (isLoadAction(action)) {
    return state
      .add(action.payload.organizations)
      .remove(action.payload.deletedOrganizations);
  }
  return state;
}
