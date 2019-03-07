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

export interface ById<T> {
  [id: string]: T | undefined;
}

export type AnyJSX = JSX.Element | JSX.Element[] | string;
