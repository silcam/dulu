export const ADD_ORGANIZATION_PEOPLE = "ADD_ORGANIZATION_PEOPLE";
export const SET_ORGANIZATION_PERSON = "SET_ORGANIZATION_PERSON";
export const DELETE_ORGANIZATION_PERSON = "DELETE_ORGANIZATION_PERSON";

export function addOrganizationPeople(organizationPeople) {
  return {
    type: ADD_ORGANIZATION_PEOPLE,
    organizationPeople: organizationPeople
  };
}

export function setOrganizationPerson(organizationPerson) {
  return {
    type: SET_ORGANIZATION_PERSON,
    organizationPerson: organizationPerson
  };
}

export function deleteOrganizationPerson(id) {
  return {
    type: DELETE_ORGANIZATION_PERSON,
    id: id
  };
}
