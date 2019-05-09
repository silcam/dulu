import List from "../../../app/javascript/models/List";

interface Thing {
  id: number;
  word?: string;
}

const EMPTY_THING: Thing = {
  id: 0
};

function aFewThings() {
  return [{ id: 4 }, { id: 10 }, { id: 1 }, { id: 8 }];
}

function aList() {
  return new List<Thing>(EMPTY_THING, aFewThings());
}

function aSortedList() {
  return new List<Thing>(EMPTY_THING, aFewThings(), (a, b) => a.id - b.id);
}

function idsOf(list: List<Thing>) {
  return list.map(item => item.id);
}

test("List is sorted", () => {
  expect(idsOf(aSortedList())).toEqual([1, 4, 8, 10]);
});

test("Get returns emptyItem if id not found", () => {
  const foundThing = new List(EMPTY_THING).get(44);
  expect(foundThing.id).toBe(0);
});

test("Get returns the item", () => {
  const foundThing = aList().get(10);
  expect(foundThing.id).toBe(10);
});

test("Add one thing", () => {
  const list = aList().add([{ id: 5 }]);
  expect(idsOf(list)).toEqual([4, 10, 1, 8, 5]);
});

test("Add one thing sorted", () => {
  const list = aSortedList().add([{ id: 5 }]);
  expect(idsOf(list)).toEqual([1, 4, 5, 8, 10]);
});

test("Update one thing", () => {
  const list = aList().add([{ id: 4, word: "yo" }]);
  expect(list.length()).toBe(4);
  expect(list.get(4).word).toEqual("yo");
  // word property is preserved:
  const list2 = list.add([{ id: 4 }]);
  expect(list2.get(4).word).toEqual("yo");
});

test("Add and update together", () => {
  const list = aSortedList().add([
    { id: 27, word: "hm" },
    { id: 8, word: "wooh" }
  ]);
  expect(idsOf(list)).toEqual([1, 4, 8, 10, 27]);
  expect(list.get(8).word).toEqual("wooh");
  expect(list.get(27).word).toEqual("hm");
});

test("addAndPrune removes non-included, adds new properties, preserves old properties", () => {
  const list1 = aList().add([{ id: 4, word: "yo" }]);
  const list2 = list1.addAndPrune([
    { id: 4 },
    { id: 8, word: "wooh" },
    { id: 27 }
  ]);
  expect(idsOf(list2)).toEqual([4, 8, 27]);
  expect(list2.get(4).word).toEqual("yo");
  expect(list2.get(8).word).toEqual("wooh");
});

test("Remove removes the item", () => {
  const list = aList().remove(1);
  expect(list.length()).toBe(3);
  expect(list.get(1).id).toBe(0);
});

test("Remove does not alter the original list", () => {
  const list = aList();
  const newList = list.remove(1);
  expect(list).not.toBe(newList);
  expect(list.length()).toBe(4);
  expect(newList.length()).toBe(3);
});

test("map maps", () => {
  expect(aList().map(item => item.id)).toEqual([4, 10, 1, 8]);
});

test("filter filters", () => {
  const list = aList().filter(item => item.id > 4);
  expect(list.map(item => item.id)).toEqual([10, 8]);
});

test("filter returns new list", () => {
  const list = aList();
  const newList = list.filter(item => item.id > 4);
  expect(list).not.toBe(newList);
  expect(list.length()).toBe(4);
  expect(newList.length()).toBe(2);
});
