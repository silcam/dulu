/**
 * Returns a copy of array without item
 * @param {array} array 
 * @param {any} item The item to remove
 */
function arrayDelete(array, item) {
    let index = array.indexOf(item)
    if (index == -1) return array
    return array.slice(0, index) + array.slice(index+1)
}

export { arrayDelete }