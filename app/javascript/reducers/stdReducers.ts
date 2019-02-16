import update from "immutability-helper";

interface Item {
  id: number;
}

interface ById<T> {
  [id: string]: T | undefined;
}

interface State<T> {
  list: number[];
  byId: ById<T>;
}

interface CompareFunc<T> {
  (a: T, b: T): number;
}

export function stdReducers<T extends Item>(
  emptyItem: T,
  compare: CompareFunc<T>
) {
  return {
    setList: (items: T[]) => setList(items, emptyItem),
    addItems: (state: State<T>, items: T[]) =>
      addItems(state, items, emptyItem, compare),
    deleteItem: deleteItem
  };
}

function setList<T extends Item>(items: T[], emptyItem: T): State<T> {
  return {
    list: items.map(item => item.id),
    byId: items.reduce(
      (accum, item) => {
        accum[item.id] = updatedItem(accum, item, emptyItem);
        return accum;
      },
      {} as ById<T>
    )
  };
}

function addItems<T extends Item>(
  state: State<T>,
  items: T[],
  emptyItem: T,
  compare: CompareFunc<T>
): State<T> {
  const byId = items.reduce(
    (byId, item) =>
      update(byId, { [item.id]: { $set: updatedItem(byId, item, emptyItem) } }),
    state.byId
  );
  let list = Object.keys(byId).map(idStr => parseInt(idStr));
  if (compare !== undefined) sortList(list, byId, compare);
  return {
    list: list,
    byId: byId
  };
}

// function addItemsNoList<T extends Item>(state: ById<T>, items: T[]) {
//   return items.reduce(
//     (accumState, item) => update(accumState, { [item.id]: mergeOrSet(item) }),
//     state
//   );
// }

// function addItem(state: State, item: Item, compare: CompareFunc) {
//   let list = update(state.list, { $push: [item.id] });
//   const byId = update(state.byId, { [item.id]: { $set: item } });
//   if (compare !== undefined) sortList(list, byId, compare);
//   return {
//     list: list,
//     byId: byId
//   };
// }

// function setItem(state: State, item: Item, compare: CompareFunc) {
//   if (!state.byId[item.id]) return addItem(state, item, compare);
//   const byId = update(state.byId, { [item.id]: { $merge: item } });
//   let list = state.list;
//   if (compare !== undefined) {
//     list = [...list];
//     sortList(list, byId, compare);
//   }
//   return {
//     list: list,
//     byId: byId
//   };
// }

// function setItemNoList(state: ById, item: Item) {
//   return update(state, { [item.id]: mergeOrSet(item) });
// }

function deleteItem<T extends Item>(state: State<T>, id: number): State<T> {
  const index = state.list.indexOf(id);
  if (index < 0) return state;
  return {
    list: update(state.list, { $splice: [[index, 1]] }) as number[],
    byId: update(state.byId, { $unset: [id] })
  };
}

function updatedItem<T extends Item>(byId: ById<T>, item: T, emptyItem: T) {
  const mergeTarget = byId[item.id] ? byId[item.id] : emptyItem;
  return update(mergeTarget, { $merge: item });
}

function sortList<T extends Item>(
  list: number[],
  byId: ById<T>,
  compare: CompareFunc<T>
) {
  list.sort((a, b) => compare(byId[a]!, byId[b]!));
}
