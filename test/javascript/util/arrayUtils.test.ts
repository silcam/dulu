import * as arrayUtils from "../../../app/javascript/util/arrayUtils";

test("arrayDelete removes an item", () => {
  let a1 = [1, 2, 3];
  let a2 = arrayUtils.arrayDelete(a1, 2);
  expect(a2).toEqual([1, 3]);
  expect(a2).not.toBe(a1);
});

test("arrayDelete survives missing item", () => {
  let a1 = [1, 2, 3];
  let a2 = arrayUtils.arrayDelete(a1, 4);
  expect(a2).toEqual(a1);
});

test("itemAfter returns next item", () => {
  expect(arrayUtils.itemAfter([1, 2, 3], 2)).toBe(3);
});

test("itemAfter last item is undefined", () => {
  expect(arrayUtils.itemAfter([1, 2, 3], 3)).toBeUndefined();
});

test("itemAfter missing item is undefined", () => {
  expect(arrayUtils.itemAfter([1, 2, 3], 0)).toBeUndefined();
});

const english = { id: 404, name: "English" };
const french = { id: 123, name: "French" };
const hdi = { id: 505, name: "Hdi" };
const langs = [english, french, hdi];
// const langCompare = (a, b) => a.name.localeCompare(b.name);

// test("insertInto Basaa goes in first", () => {
//   const basaa = { id: 142, name: "Basaa" };
//   const exp = [basaa].concat(langs);
//   expect(arrayUtils.insertInto(langs, basaa, langCompare)).toEqual(exp);
// });

// test("insertInto Ghomala goes in the middle", () => {
//   const ghomala = { id: 132, name: "Ghomala" };
//   const exp = [english, french, ghomala, hdi];
//   expect(arrayUtils.insertInto(langs, ghomala, langCompare)).toEqual(exp);
// });

// test("insertInto Sango goes at the end", () => {
//   const sango = { id: 2839, name: "Sango" };
//   const exp = langs.concat([sango]);
//   expect(arrayUtils.insertInto(langs, sango, langCompare)).toEqual(exp);
// });

const fakeT = (key: string) => key.toUpperCase();

test("print translated array", () => {
  expect(arrayUtils.print(["one", "two", "three"], fakeT)).toEqual(
    "ONE, TWO, THREE"
  );
});

test("print translated array with prefix", () => {
  expect(arrayUtils.print(["One", "Two", "three"], fakeT, "pre")).toEqual(
    "PRE.ONE, PRE.TWO, PRE.THREE"
  );
});

test("Find by id", () => {
  expect(arrayUtils.findById(langs, 505)).toBe(hdi);
});

test("findIndexById", () => {
  expect(arrayUtils.findIndexById(langs, 505)).toBe(2);
});

// Typescript flags this as wrong anyway
// test("findIndexById works with string ids", () => {
//   expect(arrayUtils.findIndexById(langs, "123")).toBe(1);
// });

test("deleteFrom deletes by id", () => {
  expect(arrayUtils.deleteFrom(langs, 505)).toEqual([english, french]);
});

test("deleteFrom returns same array if id not found", () => {
  expect(arrayUtils.deleteFrom(langs, 5656)).toEqual(langs);
});

// test("replace updates items and returns a new array", () => {
//   const newFrench = { id: 123, name: "Français" };
//   const newLangs = arrayUtils.replace(langs, newFrench);
//   expect(newLangs).toEqual([english, newFrench, hdi]);
//   expect(newLangs).not.toBe(langs);
// });

test("flat", () => {
  const a = [1, [2, 3, 4]];
  expect(arrayUtils.flat(a)).toEqual([1, 2, 3, 4]);
});

test("all", () => {
  expect(arrayUtils.all([1, 2, 3], num => num > 0)).toBe(true);
  expect(arrayUtils.all([0, 1, 2], num => num > 0)).toBe(false);
  expect(arrayUtils.all([], () => true)).toBe(true);
});

test("max with Empty Array", () => {
  expect(arrayUtils.max([], () => 0)).toBeUndefined();
});

test("max", () => {
  expect(arrayUtils.max([4, 3, 56, 9, 0], (a, b) => a - b)).toBe(56);
});

test("sort", () => {
  const sorted = arrayUtils.sort([4, 3, 56, 9, 0], (a, b) => a - b);
  expect(sorted).toEqual([0, 3, 4, 9, 56]);
});

test("equals", () => {
  expect(arrayUtils.equals([1, 2, 3], [1, 2, 3])).toBe(true);
  expect(arrayUtils.equals([1, 2], [1, 2, 3])).toBe(false);
  expect(arrayUtils.equals([1, 2, 3], [1, 2])).toBe(false);
  expect(arrayUtils.equals([1, 2, 3], [1, 2, 4])).toBe(false);
});
