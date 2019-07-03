import FuzzyDate, { IFuzzyDate } from "../util/FuzzyDate";
import update from "immutability-helper";
import { AnyObj } from "./TypeBucket";
import { ILanguage } from "./Language";
import { ICluster } from "./Cluster";
import { ICan } from "../actions/canActions";
import { Domain } from "./Domain";

export interface IPeriod {
  start?: { year: number; month?: number };
  end?: { year: number; month?: number };
}

export interface IEventParticipant {
  id: number;
  person_id: number;
  roles: string[];
  _destroy?: boolean; // For API
}

export interface IEventParticipantExtended extends IEventParticipant {
  full_name: string;
}

export const EventCategories: {
  [domain: string]: { [category: string]: string[] };
} = {
  Anthropology: {},
  Community_development: {},
  Ethnomusicology: {},
  Linguistics: { Workshop: [] },
  Literacy: {
    TeacherTraining: ["Literacy", "MLE"],
    TeacherRefresher: ["Literacy", "MLE"],
    Workshop: [
      "Mobilization",
      "Bloom",
      "Primer_1",
      "Primer_2",
      "TransitionManual",
      "Writers",
      "FunctionalLiteracy",
      "MLE_advocacy",
      "MLE_material_production"
    ],
    Class: ["Primer_1", "Primer_2", "TransitionManual"]
  },
  Scripture_use: {},
  Mobilization: {},
  Translation: {
    ConsultantChecking: [],
    PreChecking: [],
    CitSupervisedChecking: [],
    Training: ["Translators", "Reviewers", "BackTranslators"],
    Workshop: []
  }
};

export interface IEvent {
  id: number;
  name: string;
  domain: Domain;
  category: string;
  subcategory: string;
  start_date: string;
  end_date: string;
  language_ids: number[];
  cluster_ids: number[];
  event_participants: IEventParticipant[];
  can: ICan;
  workshop_id?: number;
  workshop_activity_id?: number;
  note: string;
}

export interface IEventInflated extends IEvent {
  languages: ILanguage[];
  clusters: ICluster[];
  event_participants: IEventParticipantExtended[];
}

interface CompEvent {
  start_date: string;
  end_date: string;
}

export default class Event {
  static domainEvents(allEvents: IEvent[], domain: string) {
    return allEvents.filter(e => e.domain == domain);
  }

  // Sorts by start_date, then by end_date
  static compare(a: IEvent, b: IEvent) {
    const startDateCompare = a.start_date.localeCompare(b.start_date);
    return startDateCompare == 0
      ? a.end_date.localeCompare(b.end_date)
      : startDateCompare;
  }

  static revCompare(a: IEvent, b: IEvent) {
    return Event.compare(b, a);
  }

  // Returns <0 for past, 0 for current, >0 for future
  static isPastCurrentFuture(event: IEvent) {
    const todayEvent = {
      start_date: FuzzyDate.today(),
      end_date: FuzzyDate.today()
    };
    return this.overlapCompare(event, todayEvent);
  }

  // Returns <0 for a is before b,
  //         >0 for a is after b,
  //          0 for a and b overlap
  static overlapCompare(a: CompEvent, b: CompEvent) {
    if (FuzzyDate.compareStr(a.end_date, b.start_date) < 0) return -1;
    if (FuzzyDate.compareStr(b.end_date, a.start_date) < 0) return 1;
    // if (a.end_date < b.start_date) return -1;
    // if (b.end_date < a.start_date) return 1;
    return 0;
  }

  // Input {start?: {year: int, month?: int}, end?: {year: int, month?: int}}
  // Output {start_date: yyyy-mm, end_date: yyyy-mm}
  static comparisonEvent(period: IPeriod) {
    return {
      start_date: period.start ? FuzzyDate.toString(period.start) : "0000",
      end_date: period.end ? FuzzyDate.toString(period.end) : "9999"
    };
  }

  static overlapsMonth(event: IEvent, year: number, month: number) {
    return overlapsFuzzyDate(event, { year, month });
  }

  static overlapsYear(event: IEvent, year: number) {
    return overlapsFuzzyDate(event, { year });
  }

  static ensureEndDate<T extends IEvent>(event: T) {
    return event.end_date
      ? event
      : update(event, { end_date: { $set: event.start_date } });
  }

  static prepareEventParams(
    event: IEventInflated,
    oldEventParticipants?: IEventParticipant[]
  ): AnyObj {
    const cluster_ids = event.clusters.map(c => c.id);
    const language_ids = event.languages.map(p => p.id);
    let eventParticipantsAttributes: AnyObj = event.event_participants.reduce(
      (accum, participant, index) => {
        accum[index] = participant;
        return accum;
      },
      {} as AnyObj
    );
    if (oldEventParticipants) {
      oldEventParticipants.forEach(participant => {
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

  static languageBackToId(languageId: number) {
    return `langauge-${languageId}`;
  }

  static personBackToId(personId: number) {
    return `person=${personId}`;
  }
}

function overlapsFuzzyDate(event: CompEvent, fdate: IFuzzyDate) {
  return (
    FuzzyDate.compare(FuzzyDate.toObject(event.start_date), fdate) <= 0 &&
    FuzzyDate.compare(FuzzyDate.toObject(event.end_date), fdate) >= 0
  );
}
