import { SyntheticEvent } from "react";

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

export interface IOrganization {
  id: number;
  name: string;
}

export interface IOrganizationPerson {
  id: number;
  person_id: number;
  organization_id: number;
}

export interface ById<T> {
  [id: string]: T | undefined;
}
