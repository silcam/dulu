import update from "immutability-helper";
import mergeOrSet from "../../../app/javascript/util/mergeOrSet";

test("set", () => {
  expect(update({}, { item: mergeOrSet({ name: "Name" }) })).toEqual({
    item: { name: "Name" }
  });
});

test("merge", () => {
  expect(
    update({ item: { name: "Name" } }, { item: mergeOrSet({ alias: "Alias" }) })
  ).toEqual({
    item: { name: "Name", alias: "Alias" }
  });
});
