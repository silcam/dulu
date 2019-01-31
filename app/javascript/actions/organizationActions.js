export const SET_ORGANIZATIONS = "SET_ORGANIZATIONS";
export const ADD_ORGANIZATIONS = "ADD_ORGANIZATIONS";
export const ADD_ORGANIZATION = "ADD_ORGANIZATION";
export const SET_ORGANIZATION = "SET_ORGANIZATION";
export const DELETE_ORGANIZATION = "DELETE_ORGANIZATION";

export function setOrganizations(organizations) {
  return {
    type: SET_ORGANIZATIONS,
    organizations: organizations
  };
}

export function addOrganizations(organizations) {
  return {
    type: ADD_ORGANIZATIONS,
    organizations: organizations
  };
}

export function addOrganization(organization) {
  return {
    type: ADD_ORGANIZATION,
    organization: organization
  };
}

export function setOrganization(organization) {
  return {
    type: SET_ORGANIZATION,
    organization: organization
  };
}

export function deleteOrganization(id) {
  return {
    type: DELETE_ORGANIZATION,
    id: id
  };
}
