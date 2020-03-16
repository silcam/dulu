import {
  ADD_EVENTS,
  ADD_EVENTS_FOR_LANGUAGE,
  SET_EVENT,
  DELETE_EVENT,
  ADD_EVENTS_FOR_PERSON,
  EventAction
} from "../actions/eventActions";
import Event, { emptyEventList } from "../models/Event";
import update from "immutability-helper";
import { IEvent, IPeriod } from "../models/Event";
import List from "../models/List";
import { isLoadAction } from "./LoadAction";

export interface EventState {
  list: List<IEvent>;
  backTo: { [backToId: string]: number | undefined };
}

const emptyState = {
  list: emptyEventList(),
  backTo: {}
};

export default function eventsReducer(
  state = emptyState,
  action: EventAction
): EventState {
  if (isLoadAction(action)) {
    return {
      ...state,
      list: state.list
        .add(action.payload.events)
        .remove(action.payload.deletedEvents)
    };
  }
  switch (action.type) {
    case SET_EVENT:
      return update(state, {
        list: { $set: state.list.add([action.event!]) }
      });
    case DELETE_EVENT:
      return update(state, { list: { $set: state.list.remove(action.id!) } });
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
  const list = state.list.add(events!);
  const periodEvent = Event.comparisonEvent(period!);
  const removeEvent = (event: IEvent) =>
    Event.overlapCompare(event, periodEvent) == 0 &&
    !events!.some(e => e.id == event.id) &&
    extraFilter(event);
  const filteredList = list.filter(event => !removeEvent(event));
  return update(state, { list: { $set: filteredList } });
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
    event.language_ids.includes(action.languageId!);
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
