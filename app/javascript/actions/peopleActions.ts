import { Person } from "../models/Person";

export const SET_PEOPLE = "SET_PEOPLE";
export const ADD_PEOPLE = "ADD_PEOPLE";
export const ADD_PERSON = "ADD_PERSON";
export const SET_PERSON = "SET_PERSON";
export const DELETE_PERSON = "DELETE_PERSON";

export interface PeopleAction {
  type: string;
  people?: Person[];
  person?: Person;
  id?: number;
}

export function setPeople(people: Person[]): PeopleAction {
  return {
    type: SET_PEOPLE,
    people: people
  };
}

export function addPeople(people: Person[]): PeopleAction {
  return {
    type: ADD_PEOPLE,
    people: people
  };
}

export function addPerson(person: Person): PeopleAction {
  return {
    type: ADD_PERSON,
    person: person
  };
}

export function setPerson(person: Person): PeopleAction {
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
