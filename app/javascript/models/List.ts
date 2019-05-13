import update from "immutability-helper";
import { ById, PartialModel } from "./TypeBucket";

export default class List<T extends { id: number }> {
  private items: Array<T>;
  private emptyItem: T;
  private sort?: (a: T, b: T) => number;

  constructor(
    emptyItem: T,
    items: Array<T> = [],
    sort?: (a: T, b: T) => number
  ) {
    this.items = items;
    this.emptyItem = emptyItem;
    this.sort = sort;
    if (sort) this.items.sort(sort);
  }

  get(id: number) {
    const item = this.items.find(item => item.id == id);
    // if (!item) console.error(`Item with id ${id} not found in the list.`);
    return item || this.emptyItem;
  }

  length() {
    return this.items.length;
  }

  // New items are added. Existing items are updated by merging
  add(itemsToAdd: PartialModel<T>[]) {
    const newItems = itemsToAdd.reduce((items, itemToAdd) => {
      const existingIndex = items.findIndex(
        oldItem => oldItem.id == itemToAdd.id
      );
      const mergeTarget =
        existingIndex >= 0 ? items[existingIndex] : this.emptyItem;
      const newItem = update(mergeTarget, { $merge: itemToAdd });
      if (existingIndex >= 0) {
        return update(items, {
          $splice: [[existingIndex, 1, newItem]]
        }) as T[];
      } else {
        return items.concat([newItem]);
      }
    }, this.items);
    if (this.sort) newItems.sort(this.sort);
    return new List(this.emptyItem, newItems, this.sort);
  }

  // Add/update items, removing any existing items not on the list
  // of items to add
  addAndPrune(itemsToAdd: T[]) {
    const list = this.filter(item =>
      itemsToAdd.some(addItem => item.id == addItem.id)
    );
    return list.add(itemsToAdd);
  }

  remove(id: number) {
    return this.filter(item => item.id != id);
  }

  map<U>(callback: (item: T, index?: number) => U) {
    return this.items.map(callback);
  }

  filter(callback: (item: T) => boolean) {
    const newItems = this.items.filter(callback);
    return new List(this.emptyItem, newItems, this.sort);
  }

  some(callback: (item: T) => boolean) {
    return this.items.some(callback);
  }

  find(callback: (item: T) => boolean) {
    return this.items.find(callback);
  }

  // Transitional "escape hatches"
  asArray() {
    return this.filter(_ => true);
  }

  asById() {
    return this.items.reduce(
      (byId, item) => {
        byId[item.id] = item;
        return byId;
      },
      {} as ById<T>
    );
  }
}
