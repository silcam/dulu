export const SET_PEOPLE = "SET_PEOPLE";
export const ADD_PEOPLE = "ADD_PEOPLE";
export const ADD_PERSON = "ADD_PERSON";
export const SET_PERSON = "SET_PERSON";
export const DELETE_PERSON = "DELETE_PERSON";

export function setPeople(people) {
  return {
    type: SET_PEOPLE,
    people: people
  };
}

export function addPeople(people) {
  return {
    type: ADD_PEOPLE,
    people: people
  };
}

export function addPerson(person) {
  return {
    type: ADD_PERSON,
    person: person
  };
}

export function setPerson(person) {
  return {
    type: SET_PERSON,
    person: person
  };
}

export function deletePerson(id) {
  return {
    type: DELETE_PERSON,
    id: id
  };
}
