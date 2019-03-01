import { IOrganizationPerson } from "../models/Organization";

export const ADD_ORGANIZATION_PEOPLE = "ADD_ORGANIZATION_PEOPLE";
export const SET_ORGANIZATION_PERSON = "SET_ORGANIZATION_PERSON";
export const DELETE_ORGANIZATION_PERSON = "DELETE_ORGANIZATION_PERSON";

export interface OrganizationPeopleAction {
  type: string;
  organizationPeople?: IOrganizationPerson[];
  organizationPerson?: IOrganizationPerson;
  id?: number;
}

export function addOrganizationPeople(
  organizationPeople: IOrganizationPerson[]
): OrganizationPeopleAction {
  return {
    type: ADD_ORGANIZATION_PEOPLE,
    organizationPeople: organizationPeople
  };
}

export function setOrganizationPerson(
  organizationPerson: IOrganizationPerson
): OrganizationPeopleAction {
  return {
    type: SET_ORGANIZATION_PERSON,
    organizationPerson: organizationPerson
  };
}

export function deleteOrganizationPerson(id: number): OrganizationPeopleAction {
  return {
    type: DELETE_ORGANIZATION_PERSON,
    id: id
  };
}
