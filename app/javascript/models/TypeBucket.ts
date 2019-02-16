import { BasicModel } from "./BasicModel";
import { ICluster } from "./Cluster";
import { Person } from "./Person";

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
  };
}

export interface UpdaterFunc {
  (arg: AnyObj): void;
}
