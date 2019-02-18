// import update from "immutability-helper";
// import mergeOrSet from "../util/mergeOrSet";

// interface Item {
//   id: number;
// }

// interface ById {
//   [id: string]: Item;
// }

// interface State {
//   list: number[];
//   byId: ById;
// }

// interface CompareFunc {
//   (a: any, b: any): number;
// }

// export function setList(state: State, items: Item[]) {
//   return {
//     list: items.map(item => item.id),
//     byId: items.reduce(
//       (accum, item) => {
//         const oldItem = state.byId[item.id] || {};
//         accum[item.id] = update(oldItem, { $merge: item }) as Item;
//         return accum;
//       },
//       {} as ById
//     )
//   };
// }

// export function addItems(state: State, items: Item[], compare: CompareFunc) {
//   const byId = items.reduce(
//     (byId, item) => update(byId, { [item.id]: mergeOrSet(item) }),
//     state.byId
//   );
//   let list = Object.keys(byId).map(idStr => parseInt(idStr));
//   if (compare !== undefined) sortList(list, byId, compare);
//   return {
//     list: list,
//     byId: byId
//   };
// }

// export function addItemsNoList(state: ById, items: Item[]) {
//   return items.reduce(
//     (accumState, item) => update(accumState, { [item.id]: mergeOrSet(item) }),
//     state
//   );
// }

// export function addItem(state: State, item: Item, compare: CompareFunc) {
//   let list = update(state.list, { $push: [item.id] });
//   const byId = update(state.byId, { [item.id]: { $set: item } });
//   if (compare !== undefined) sortList(list as number[], byId, compare);
//   return {
//     list: list,
//     byId: byId
//   };
// }

// export function setItem(state: State, item: Item, compare: CompareFunc) {
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

// export function setItemNoList(state: ById, item: Item) {
//   return update(state, { [item.id]: mergeOrSet(item) });
// }

// export function deleteItem(state: State, id: number) {
//   const index = state.list.indexOf(id);
//   if (index < 0) return state;
//   return {
//     list: update(state.list, { $splice: [[index, 1]] }),
//     byId: update(state.byId, { [id]: { $set: undefined } })
//   };
// }

// function sortList(list: number[], byId: ById, compare: CompareFunc) {
//   list.sort((a, b) => compare(byId[a], byId[b]));
// }
