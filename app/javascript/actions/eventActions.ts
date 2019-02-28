import Event from "../models/Event";
import { IEvent, IPeriod } from "../models/Event";
import { Person } from "../models/Person";

export const ADD_EVENTS = "ADD_EVENTS";
export const ADD_EVENTS_FOR_LANGUAGE = "ADD_EVENTS_FOR_LANGUAGE";
export const ADD_EVENTS_FOR_PERSON = "ADD_EVENTS_FOR_PERSON";
export const SET_EVENT = "SET_EVENT";
export const DELETE_EVENT = "DELETE_EVENT";

export interface EventAction {
  type: string;
  events?: IEvent[];
  event?: IEvent;
  languageId?: number;
  period?: IPeriod;
  backToId?: string;
  person?: Person;
  id?: number;
}

export function setEvent(event: IEvent): EventAction {
  return {
    type: SET_EVENT,
    event
  };
}

export function addEvents(events: IEvent[], period: IPeriod): EventAction {
  return {
    type: ADD_EVENTS,
    events,
    period
  };
}

export function addEventsForLanguage(
  events: IEvent[],
  languageId: number,
  period: IPeriod
): EventAction {
  return {
    type: ADD_EVENTS_FOR_LANGUAGE,
    backToId: Event.languageBackToId(languageId),
    events,
    languageId,
    period
  };
}

export function addEventsForPerson(
  events: IEvent[],
  person: Person,
  period: IPeriod
): EventAction {
  return {
    type: ADD_EVENTS_FOR_PERSON,
    backToId: Event.personBackToId(person.id),
    events,
    person,
    period
  };
}

export function deleteEvent(id: number): EventAction {
  return {
    type: DELETE_EVENT,
    id
  };
}
