import { SyntheticEvent } from "react";
import { ICan } from "../actions/canActions";

export interface AnyObj {
  [key: string]: any;
}

export interface SetCan {
  (key: string, can: ICan): void;
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
    target: { name: string; value: any };
  };
}

export interface JSEventHandler {
  (e: SyntheticEvent): void;
}

export interface UpdaterFunc {
  (arg: AnyObj): void;
}

export interface ById<T> {
  [id: string]: T | undefined;
}

export type AnyJSX = JSX.Element | JSX.Element[] | string;

export type Partial<T> = { [P in keyof T]?: T[P] };

export type Children = JSX.Element | JSX.Element[] | undefined;
