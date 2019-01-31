import update from "immutability-helper";

export default function mergeOrSet(newItem) {
  return item => (item ? update(item, { $merge: newItem }) : newItem);
}
