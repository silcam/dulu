import update from "immutability-helper";
import { T } from "../i18n/i18n";

interface WithId {
  id: number;
}

/**
 * Returns a copy of array without item
 * @param {array} array
 * @param {any} item The item to remove
 */
export function arrayDelete<T>(array: T[], item: T) {
  let index = array.indexOf(item);
  if (index == -1) return array;
  return update(array, { $splice: [[index, 1]] }) as T[];
}

export function itemAfter<T>(array: T[], item: T) {
  let index = array.indexOf(item);
  if (index == -1 || index == array.length - 1) return undefined;
  return array[index + 1];
}

// export function insertInto(array, newItem, compare) {
//   let index = array.findIndex(item => compare(newItem, item) < 0);
//   return index >= 0
//     ? update(array, { $splice: [[index, 0, newItem]] })
//     : update(array, { $push: [newItem] });
// }

export function print<Ty>(array: Ty[], t: T, keyPrefix: string) {
  keyPrefix = keyPrefix ? keyPrefix + "." : "";
  return array.map(item => t(keyPrefix + item)).join(", ");
}

export function findById<T extends WithId>(array: T[], id: number) {
  return array[findIndexById(array, id)];
}

export function findIndexById<T extends WithId>(array: T[], id: number) {
  return array.findIndex(item => item.id == id);
}

export function deleteFrom<T extends WithId>(array: T[], id: number) {
  const deleteIndex = findIndexById(array, id);
  return deleteIndex >= 0
    ? update(array, { $splice: [[deleteIndex, 1]] })
    : array;
}

// export function replace(array, item) {
//   const index = findIndexById(array, item.id);
//   return update(array, { [index]: { $set: item } });
// }

export function overlap<T>(a: T[], b: T[]) {
  return a.some(aItem => b.includes(aItem));
}

// export function subtractById<T extends { id: number }>(a: T[], b: T[]) {
//   return a.filter(aItem => !b.some(bItem => bItem.id == aItem.id));
// }

export function subtract<T>(a: T[], b: T[]) {
  return a.filter(aItem => !b.some(bItem => bItem == aItem));
}
