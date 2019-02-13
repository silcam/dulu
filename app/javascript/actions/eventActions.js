import Event from "../models/Event";

export const ADD_EVENTS = "ADD_EVENTS";
export const ADD_EVENTS_FOR_LANGUAGE = "ADD_EVENTS_FOR_LANGUAGE";
export const ADD_EVENTS_FOR_PERSON = "ADD_EVENTS_FOR_PERSON";
export const SET_EVENT = "SET_EVENT";
export const DELETE_EVENT = "DELETE_EVENT";

export function setEvent(event) {
  return {
    type: SET_EVENT,
    event
  };
}

export function addEvents(events, period) {
  return {
    type: ADD_EVENTS,
    events,
    period
  };
}

export function addEventsForLanguage(events, language, period) {
  return {
    type: ADD_EVENTS_FOR_LANGUAGE,
    backToId: Event.languageBackToId(language.id),
    events,
    language,
    period
  };
}

export function addEventsForPerson(events, person, period) {
  return {
    type: ADD_EVENTS_FOR_PERSON,
    backToId: Event.personBackToId(person.id),
    events,
    person,
    period
  };
}

export function deleteEvent(id) {
  return {
    type: DELETE_EVENT,
    id
  };
}
