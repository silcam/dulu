import SelectInput from "../../../../app/javascript/components/shared/SelectInput";

test("Indexed Options", () => {
  expect(SelectInput.indexedOptions(["Joe", "Fred", "Gary"])).toEqual([
    { value: "0", display: "Joe" },
    { value: "1", display: "Fred" },
    { value: "2", display: "Gary" }
  ]);
});

test("selectOptionsFromObject", () => {
  expect(
    SelectInput.fromObjectOptions({
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
