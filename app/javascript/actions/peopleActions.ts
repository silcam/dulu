import { IPerson } from "../models/Person";

export const ADD_PEOPLE = "ADD_PEOPLE";

export interface PeopleAction {
  type: string;
  people?: IPerson[];
  person?: IPerson;
  id?: number;
}

export function addPeople(people: IPerson[]): PeopleAction {
  return {
    type: ADD_PEOPLE,
    people: people
  };
}
