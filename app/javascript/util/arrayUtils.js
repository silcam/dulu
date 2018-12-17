import update from "immutability-helper";

/**
 * Returns a copy of array without item
 * @param {array} array
 * @param {any} item The item to remove
 */
export function arrayDelete(array, item) {
  let index = array.indexOf(item);
  if (index == -1) return array;
  return update(array, { $splice: [[index, 1]] });
}

export function itemAfter(array, item) {
  let index = array.indexOf(item);
  if (index == -1 || index == array.length - 1) return undefined;
  return array[index + 1];
}

export function insertInto(array, newItem, compare) {
  let index = array.findIndex(item => compare(newItem, item) < 0);
  return index >= 0
    ? update(array, { $splice: [[index, 0, newItem]] })
    : update(array, { $push: [newItem] });
}

export function print(array, t, keyPrefix) {
  keyPrefix = keyPrefix ? keyPrefix + "." : "";
  return array.map(item => t(keyPrefix + item)).join(", ");
}

export function findById(array, id) {
  return array[findIndexById(array, id)];
}

export function findIndexById(array, id) {
  return array.findIndex(item => item.id == id);
}

export function deleteFrom(array, id) {
  const deleteIndex = findIndexById(array, id);
  return deleteIndex >= 0
    ? update(array, { $splice: [[deleteIndex, 1]] })
    : array;
}

export function replace(array, item) {
  const index = findIndexById(array, item.id);
  return update(array, { [index]: { $set: item } });
}
