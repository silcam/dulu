import SelectInput from "../../../../app/javascript/components/shared/SelectInput";

test("Indexed Options", () => {
  expect(SelectInput.indexedOptions(["Joe", "Fred", "Gary"])).toEqual([
    { value: "0", display: "Joe" },
    { value: "1", display: "Fred" },
    { value: "2", display: "Gary" }
  ]);
});
