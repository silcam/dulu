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

export function print<Ty>(array: Ty[], t: T, keyPrefix?: string) {
  const prefix = keyPrefix ? keyPrefix + "." : "";
  return array.map(item => t(prefix + item)).join(", ");
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

// One level of flattening only
export function flat<T>(array: Array<T | T[]>) {
  return array.reduce((flatArray: T[], item) => {
    const toAdd = item instanceof Array ? item : [item];
    return flatArray.concat(toAdd);
  }, []);
}

export function all<T>(array: readonly T[], test: (t: T) => any): boolean {
  return array
    .map(item => test(item))
    .reduce((finalVal, testVal) => finalVal && testVal, true);
}

export function max<T>(
  array: readonly T[],
  compare: (a: T, b: T) => number
): T | undefined {
  if (array.length == 0) return undefined;
  return array.reduce((currentMax, item) =>
    compare(currentMax, item) > 0 ? currentMax : item
  );
}

export function sort<T>(
  array: readonly T[],
  compare: (a: T, b: T) => number
): T[] {
  const sorted: T[] = [];
  array.forEach(item => {
    let i = 0;
    while (i < sorted.length && compare(sorted[i], item) <= 0) ++i;
    sorted.splice(i, 0, item);
  });
  return sorted;
}
