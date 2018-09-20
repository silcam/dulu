import update from "immutability-helper";

export function findById(array, id) {
  return array[findIndexById(array, id)];
}

export function findIndexById(array, id) {
  return array.findIndex(item => item.id == id);
}

export function insertInto(array, newItem, compare) {
  let insertIndex = array.findIndex(item => compare(item, newItem) < 0);
  return insertIndex < 0
    ? update(array, { $push: [newItem] })
    : update(array, { $splice: [[insertIndex, 0, newItem]] });
}
