import {
  ADD_EVENTS,
  ADD_EVENTS_FOR_LANGUAGE,
  SET_EVENT,
  DELETE_EVENT,
  ADD_EVENTS_FOR_PERSON,
  EventAction
} from "../actions/eventActions";
import Event from "../models/Event";
import update from "immutability-helper";
import { IEvent, IPeriod } from "../models/Event";
import { stdReducersNoList } from "./stdReducers";

export function emptyEvent(): IEvent {
  return {
    id: 0,
    name: "",
    domain: "",
    start_date: "",
    end_date: "",
    language_ids: [],
    event_participants: []
  };
}

export interface EventState {
  byId: { [id: string]: IEvent | undefined };
  backTo: { [backToId: string]: number | undefined };
}

const emptyState = { byId: {}, backTo: {} };

const stdEventReducers = stdReducersNoList(emptyEvent());

export default function eventsReducer(
  state = emptyState,
  action: EventAction
): EventState {
  switch (action.type) {
    case SET_EVENT:
      return update(state, {
        byId: { $set: stdEventReducers.addItems(state.byId, [action.event!]) }
      });
    case DELETE_EVENT:
      return update(state, { byId: { $unset: [action.id] } });
    case ADD_EVENTS:
      return addEvents(state, action);
    case ADD_EVENTS_FOR_LANGUAGE:
      return addEventsForLanguage(state, action);
    case ADD_EVENTS_FOR_PERSON:
      return addEventsForPerson(state, action);
  }
  return state;
}

interface Filter {
  (event: IEvent): boolean;
}

function addEvents(
  state: EventState,
  { events, period }: EventAction,
  extraFilter: Filter = _e => true
) {
  let byId = stdEventReducers.addItems(state.byId, events!);
  const periodEvent = Event.comparisonEvent(period!);
  const eventIdsToRemove = Object.keys(byId).filter(
    id =>
      Event.overlapCompare(byId[id]!, periodEvent) == 0 &&
      !events!.some(e => e.id == parseInt(id)) &&
      extraFilter(byId[id]!)
  );
  byId = update(byId, { $unset: eventIdsToRemove });
  return update(state, { byId: { $set: byId } });
}

function addEventsFor(
  state: EventState,
  action: EventAction,
  extraFilter: Filter
) {
  state = addEvents(state, action, extraFilter);
  const newBackTo = backTo(state.backTo[action.backToId!], action.period!);
  return update(state, {
    backTo: { [action.backToId!]: { $set: newBackTo } }
  });
}

function addEventsForLanguage(state: EventState, action: EventAction) {
  const langFilter = (event: IEvent) =>
    event.language_ids.includes(action.language!.id);
  return addEventsFor(state, action, langFilter);
}

function addEventsForPerson(state: EventState, action: EventAction) {
  const personFilter = (event: IEvent) =>
    event.event_participants.some(e_p => e_p.person_id == action.person!.id);
  return addEventsFor(state, action, personFilter);
}

function backTo(oldBackTo: number | undefined, period: IPeriod) {
  if (!period.start) return 0;
  if (oldBackTo == undefined) return period.start.year;
  return Math.min(oldBackTo, period.start.year);
}
