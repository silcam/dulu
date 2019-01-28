import fixCaps from "util/fixCaps";

test("fix all lower case", () => {
  expect(fixCaps("rick")).toEqual("Rick");
});

test("fix all uppercase", () => {
  expect(fixCaps("CONRAD")).toEqual("Conrad");
});

test("Don't fix mixed case", () => {
  expect(fixCaps("van den Berg")).toEqual("van den Berg");
});
