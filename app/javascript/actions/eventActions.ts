import Event from "../models/Event";
import { IEvent, IPeriod, ITag } from "../models/Event";
import { IPerson } from "../models/Person";

export const ADD_EVENTS = "ADD_EVENTS";
export const ADD_EVENTS_FOR_LANGUAGE = "ADD_EVENTS_FOR_LANGUAGE";
export const ADD_EVENTS_FOR_PERSON = "ADD_EVENTS_FOR_PERSON";
export const SET_EVENT = "SET_EVENT";
export const DELETE_EVENT = "DELETE_EVENT";
export const ADD_TAG = "ADD_TAG";

export interface EventAction {
  type: string;
  events?: IEvent[];
  event?: IEvent;
  languageId?: number;
  period?: IPeriod;
  backToId?: string;
  person?: IPerson;
  id?: number;
}

// TODO, own file?
export interface TagAction {
  type: string;
  tag: ITag;
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

export interface AddEventsForLanguage {
  (events: IEvent[], languageId: number, period: IPeriod): void;
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

export type IAddEventsForPerson = (
  events: IEvent[],
  person: IPerson,
  period: IPeriod
) => void;
export function addEventsForPerson(
  events: IEvent[],
  person: IPerson,
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
