import { IOrganization } from "../models/Organization";

export const SET_ORGANIZATIONS = "SET_ORGANIZATIONS";
export const ADD_ORGANIZATIONS = "ADD_ORGANIZATIONS";
export const ADD_ORGANIZATION = "ADD_ORGANIZATION";
export const SET_ORGANIZATION = "SET_ORGANIZATION";
export const DELETE_ORGANIZATION = "DELETE_ORGANIZATION";

export interface OrganizationAction {
  type: string;
  organizations?: IOrganization[];
  organization?: IOrganization;
  id?: number;
}

export function setOrganizations(
  organizations: IOrganization[]
): OrganizationAction {
  return {
    type: SET_ORGANIZATIONS,
    organizations: organizations
  };
}

export function addOrganizations(
  organizations: IOrganization[]
): OrganizationAction {
  return {
    type: ADD_ORGANIZATIONS,
    organizations: organizations
  };
}

export function addOrganization(
  organization: IOrganization
): OrganizationAction {
  return {
    type: ADD_ORGANIZATION,
    organization: organization
  };
}

export function setOrganization(
  organization: IOrganization
): OrganizationAction {
  return {
    type: SET_ORGANIZATION,
    organization: organization
  };
}

export function deleteOrganization(id: number): OrganizationAction {
  return {
    type: DELETE_ORGANIZATION,
    id: id
  };
}
