import update from "immutability-helper";

export function setList(state, items) {
  return {
    list: items.map(item => item.id),
    byId: items.reduce((accum, item) => {
      const oldItem = state.byId[item.id] || {};
      accum[item.id] = update(oldItem, { $merge: item });
      return accum;
    }, {})
  };
}

export function addItem(state, item, compare) {
  let list = update(state.list, { $push: [item.id] });
  const byId = update(state.byId, { [item.id]: { $set: item } });
  if (compare !== undefined) sortList(list, byId, compare);
  return {
    list: list,
    byId: byId
  };
}

export function setItem(state, item, compare) {
  const byId = update(state.byId, { [item.id]: { $merge: item } });
  let list = state.list;
  if (compare !== undefined) {
    list = [...list];
    sortList(list, byId, compare);
  }
  return {
    list: list,
    byId: byId
  };
}

export function deleteItem(state, id) {
  const index = state.list.indexOf(id);
  if (index < 0) return state;
  return {
    list: update(state.list, { $splice: [[index, 1]] }),
    byId: update(state.byId, { [id]: { $set: undefined } })
  };
}

function sortList(list, byId, compare) {
  list.sort((a, b) => compare(byId[a], byId[b]));
}
