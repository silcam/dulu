import FuzzyDate from "../util/FuzzyDate";
import update from "immutability-helper";

export default class Event {
  static domainEvents(allEvents, domain) {
    return allEvents.filter(e => e.domain == domain);
  }

  // Sorts by start_date, then by end_date
  static compare(a, b) {
    const startDateCompare = a.start_date.localeCompare(b.start_date);
    return startDateCompare == 0
      ? a.end_date.localeCompare(b.end_date)
      : startDateCompare;
  }

  static revCompare(a, b) {
    return Event.compare(b, a);
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

  // Input {start?: {year: int, month?: int}, end?: {year: int, month?: int}}
  // Output {start_date: yyyy-mm, end_date: yyyy-mm}
  static comparisonEvent(period) {
    return {
      start_date: period.start ? FuzzyDate.toString(period.start) : "0000",
      end_date: period.end ? FuzzyDate.toString(period.end) : "9999"
    };
  }

  static overlapsMonth(event, year, month) {
    return overlapsFuzzyDate(event, { year, month });
  }

  static overlapsYear(event, year) {
    return overlapsFuzzyDate(event, { year });
  }

  static ensureEndDate(event) {
    return event.end_date
      ? event
      : update(event, { end_date: { $set: event.start_date } });
  }

  static prepareEventParams(event, oldEvent) {
    const cluster_ids = event.clusters.map(c => c.id);
    const language_ids = event.languages.map(p => p.id);
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
      language_ids: { $set: language_ids },
      event_participants_attributes: { $set: eventParticipantsAttributes }
    });
  }

  static languageBackToId(languageId) {
    return `langauge-${languageId}`;
  }

  static personBackToId(personId) {
    return `person=${personId}`;
  }
}

function overlapsFuzzyDate(event, fdate) {
  return (
    FuzzyDate.compare(event.start_date, fdate) <= 0 &&
    FuzzyDate.compare(event.end_date, fdate) >= 0
  );
}
