import {
  SET_PEOPLE,
  ADD_PERSON,
  SET_PERSON,
  DELETE_PERSON
} from "../actions/peopleActions";
import { personCompare } from "../models/person";
import update from "immutability-helper";

const emptyState = {
  peopleIds: [],
  peopleById: {}
};

export default function peopleReducer(state = emptyState, action) {
  switch (action.type) {
    case SET_PEOPLE:
      return setPeople(state, action.people);
    case ADD_PERSON:
      return addPerson(state, action.person);
    case SET_PERSON:
      return setPerson(state, action.person);
    case DELETE_PERSON:
      return deletePerson(state, action.id);
  }
  return state;
}

function setPeople(state, people) {
  return {
    peopleIds: people.map(person => person.id),
    peopleById: people.reduce((accum, person) => {
      const oldPerson = state.peopleById[person.id] || {};
      accum[person.id] = { ...oldPerson, ...person };
      return accum;
    }, {})
  };
}

function addPerson(state, person) {
  let peopleIds = [...state.peopleIds, person.id];
  const peopleById = { ...state.peopleById, [person.id]: person };
  sortPeopleIds(peopleIds, peopleById);
  return {
    peopleIds: peopleIds,
    peopleById: peopleById
  };
}

function setPerson(state, person) {
  let peopleIds = [...state.peopleIds];
  const peopleById = update(state.peopleById, {
    [person.id]: { $merge: person }
  });
  sortPeopleIds(peopleIds, peopleById);
  return {
    peopleIds: peopleIds,
    peopleById: peopleById
  };
}

function deletePerson(state, id) {
  const index = state.peopleIds.indexOf(id);
  if (index < 0) return state;
  return {
    peopleIds: update(state.peopleIds, { $splice: [[index, 1]] }),
    peopleById: update(state.peopleById, { [id]: { $set: undefined } })
  };
}

// Sorts in place!
function sortPeopleIds(peopleIds, peopleById) {
  peopleIds.sort((a, b) => personCompare(peopleById[a], peopleById[b]));
}
