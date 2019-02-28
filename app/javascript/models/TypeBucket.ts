import { BasicModel } from "./BasicModel";
import { ICluster } from "./Cluster";
import { Person } from "./Person";
import { SyntheticEvent } from "react";

// interface BaseParticipant {
//   id: number;
//   person_id: number;
// }

// interface LangParticipant extends BaseParticipant {
//   language_id: number;
// }

// interface ClusterParticipant extends BaseParticipant {
//   cluster_id: number;
// }

// interface LangParticipantInflated extends LangParticipant {
//   language: BasicModel;
//   cluster?: ICluster;
// }

// interface ClusterParticipantInflated extends ClusterParticipant {
//   cluster: ICluster;
//   language?: BasicModel;
// }

// export type IParticipant = LangParticipant | ClusterParticipant;
// export type IParticipantInflated =
//   | LangParticipantInflated
//   | ClusterParticipantInflated;

export interface IParticipant {
  id: number;
  person_id: number;
  cluster_id?: number;
  language_id?: number;
  roles: string[];
  start_date: string;
  end_date?: string;
}

export interface IParticipantInflated extends IParticipant {
  person: Person;
  cluster?: ICluster;
  language?: BasicModel;
}

export interface AnyObj {
  [key: string]: any;
}

export interface Setter<T> {
  (item: T): void;
}

export interface Adder<T> {
  (items: T[]): void;
}

export interface Deleter {
  (id: number): void;
}

export interface JSEvent {
  target: {
    value: any;
    target: any;
  };
}

export interface JSEventHandler {
  (e: SyntheticEvent): void;
}

export interface UpdaterFunc {
  (arg: AnyObj): void;
}

export interface Workshop {
  id: number;
  name: string;
  completed: boolean;
}

export interface IActivity {
  id: number;
  language_id: number;
  stage_name: string;
  bible_book_id: number;
  name: string;
  workshops: Workshop[];
}

export type ActivityType = "Translation" | "Media" | "Research" | "Workshops";

export interface IOrganization {
  id: number;
  name: string;
}

export interface IOrganizationPerson {
  id: number;
  person_id: number;
  organization_id: number;
}
