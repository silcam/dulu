export function findById(array, id) {
  return array[findIndexById(array, id)];
}

export function findIndexById(array, id) {
  return array.findIndex(item => item.id == id);
}
