import { IPerson } from "../models/Person";

export const SET_PEOPLE = "SET_PEOPLE";
export const ADD_PEOPLE = "ADD_PEOPLE";
export const ADD_PERSON = "ADD_PERSON";
export const SET_PERSON = "SET_PERSON";
export const DELETE_PERSON = "DELETE_PERSON";

export interface PeopleAction {
  type: string;
  people?: IPerson[];
  person?: IPerson;
  id?: number;
}

export function setPeople(people: IPerson[]): PeopleAction {
  return {
    type: SET_PEOPLE,
    people: people
  };
}

export function addPeople(people: IPerson[]): PeopleAction {
  return {
    type: ADD_PEOPLE,
    people: people
  };
}

export function addPerson(person: IPerson): PeopleAction {
  return {
    type: ADD_PERSON,
    person: person
  };
}

export function setPerson(person: IPerson): PeopleAction {
  return {
    type: SET_PERSON,
    person: person
  };
}

export function deletePerson(id: number): PeopleAction {
  return {
    type: DELETE_PERSON,
    id: id
  };
}
