import intCompare from "util/intCompare";

test("intCompare compares them all!", () => {
  expect(intCompare(4, 4)).toBe(0);
  expect(intCompare(3, 4)).toBeLessThan(0);
  expect(intCompare(4, 3)).toBeGreaterThan(0);
});
