import {
  ADD_EVENTS,
  ADD_EVENTS_FOR_LANGUAGE,
  SET_EVENT,
  DELETE_EVENT,
  ADD_EVENTS_FOR_PERSON
} from "../actions/eventActions";
import { addItemsNoList, setItemNoList } from "./reducerUtil";
import Event from "../models/Event";
import update from "immutability-helper";

const emptyState = { byId: {}, backTo: {} };

export default function eventsReducer(state = emptyState, action) {
  switch (action.type) {
    case SET_EVENT:
      return update(state, {
        byId: { $set: setItemNoList(state.byId, action.event) }
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

function addEvents(state, { events, period }, extraFilter = () => true) {
  let byId = addItemsNoList(state.byId, events);
  const periodEvent = Event.comparisonEvent(period);
  const eventIdsToRemove = Object.keys(byId).filter(
    id =>
      Event.overlapCompare(byId[id], periodEvent) == 0 &&
      !events.some(e => e.id == id) &&
      extraFilter(byId[id])
  );
  byId = update(byId, { $unset: eventIdsToRemove });
  return update(state, { byId: { $set: byId } });
}

function addEventsFor(state, action, extraFilter) {
  state = addEvents(state, action, extraFilter);
  const newBackTo = backTo(state.backTo[action.backToId], action.period);
  return update(state, {
    backTo: { [action.backToId]: { $set: newBackTo } }
  });
}

function addEventsForLanguage(state, action) {
  const langFilter = event => event.language_ids.includes(action.language.id);
  return addEventsFor(state, action, langFilter);
}

function addEventsForPerson(state, action) {
  const personFilter = event =>
    event.event_participants.some(e_p => e_p.person_id == action.person.id);
  return addEventsFor(state, action, personFilter);
}

function backTo(oldBackTo, period) {
  if (!period.start) return 0;
  if (oldBackTo == undefined) return period.start.year;
  return Math.min(oldBackTo, period.start.year);
}
