import selectOptionsFromObject from "util/selectOptionsFromObject";

test("selectOptionsFromObject", () => {
  expect(
    selectOptionsFromObject({
      a: "Apple",
      b: "Badger"
    })
  ).toEqual([
    {
      value: "a",
      display: "Apple"
    },
    {
      value: "b",
      display: "Badger"
    }
  ]);
});
