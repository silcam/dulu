import { SyntheticEvent } from "react";
import { ICan } from "../actions/canActions";

export interface YearMonth {
  year: number;
  month: number;
}

export interface AnyObj {
  [key: string]: any;
}

export interface SetCan {
  (key: string, can: ICan): void;
}

export interface Setter<T> {
  (item: T): void;
}

export interface PSetter<T extends { id: number }> {
  (item: PartialModel<T>): void;
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

export type AnyJSX = JSX.Element | JSX.Element[] | string;

export type Partial<T> = { [P in keyof T]?: T[P] };
export type PartialModel<T extends { id: number }> = Omit<Partial<T>, "id"> & {
  id: number;
};

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type Children = JSX.Element | JSX.Element[] | undefined;

export function isDefined<T>(item: T | undefined | null): item is T {
  return item !== null && item !== undefined;
}
