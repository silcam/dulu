import baseCompare from "util/baseCompare";

test("baseCompare ignores accents and case", () => {
  expect(baseCompare("Français", "francais")).toBe(0);
  expect(baseCompare("A", "B")).toBeLessThan(0);
});
