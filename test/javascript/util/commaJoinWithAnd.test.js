import commaJoinWithAnd from "../../../app/javascript/util/commaJoinWithAnd";

test("commaJoinWithAnd: one item", () => {
  const items = ["oranges"];
  expect(commaJoinWithAnd(items, "and")).toEqual("oranges");
});

test("commaJoinsWithAnd: two items", () => {
  const items = ["oranges", "apples"];
  expect(commaJoinWithAnd(items, "and")).toEqual("oranges and apples");
});

test("commaJoinsWithAnd: 3 items", () => {
  const items = ["oranges", "apples", "bananas"];
  expect(commaJoinWithAnd(items, "and")).toEqual("oranges, apples and bananas");
});
