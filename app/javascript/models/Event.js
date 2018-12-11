import FuzzyDate from "../util/FuzzyDate";
import update from "immutability-helper";
import { insertInto } from "../util/arrayUtils";

export default class Event {
  static domainEvents(allEvents, domain) {
    return allEvents.filter(e => e.domain == domain);
  }

  static flattenEvents(eventsObj) {
    return eventsObj.upcoming.concat(eventsObj.current).concat(eventsObj.past);
  }

  static addEventToEventsObj(eventsObj, event) {
    const pastCurrentFutureVal = this.isPastCurrentFuture(event);
    const arrayKey =
      pastCurrentFutureVal < 0
        ? "past"
        : pastCurrentFutureVal == 0
        ? "current"
        : "future";
    const newArray = insertInto(eventsObj[arrayKey], event, this.compare);
    return update(eventsObj, { [arrayKey]: { $set: newArray } });
  }

  // Sorts by start_date, then by end_date
  static compare(a, b) {
    const startDateCompare = a.start_date.localeCompare(b.start_date);
    return startDateCompare == 0
      ? a.end_date.localeCompare(b.end_date)
      : startDateCompare;
  }

  // Returns <0 for past, 0 for current, >0 for future
  static isPastCurrentFuture(event) {
    const todayEvent = {
      start_date: FuzzyDate.today(),
      end_date: FuzzyDate.today()
    };
    return this.overlapCompare(event, todayEvent);
  }

  // Returns <0 for a is before b,
  //         >0 for a is after b,
  //          0 for a and b overlap
  static overlapCompare(a, b) {
    if (FuzzyDate.compare(a.end_date, b.start_date) < 0) return -1;
    if (FuzzyDate.compare(b.end_date, a.start_date) < 0) return 1;
    // if (a.end_date < b.start_date) return -1;
    // if (b.end_date < a.start_date) return 1;
    return 0;
  }

  static prepareEventParams(event, oldEvent) {
    const cluster_ids = event.clusters.map(c => c.id);
    const program_ids = event.programs.map(p => p.id);
    let eventParticipantsAttributes = event.event_participants.reduce(
      (accum, participant, index) => {
        accum[index] = participant;
        return accum;
      },
      {}
    );
    if (oldEvent) {
      oldEvent.event_participants.forEach(participant => {
        if (!event.event_participants.some(p => p.id == participant.id))
          eventParticipantsAttributes[
            Object.keys(eventParticipantsAttributes).length
          ] = {
            id: participant.id,
            _destroy: true
          };
      });
    }
    return update(event, {
      cluster_ids: { $set: cluster_ids },
      program_ids: { $set: program_ids },
      event_participants_attributes: { $set: eventParticipantsAttributes }
    });
  }
}
