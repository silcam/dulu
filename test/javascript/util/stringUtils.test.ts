import { allMatches, fixCaps } from "../../../app/javascript/util/stringUtils";

test("allMatches", () => {
  const str = "Lng4 DTra Lng32 Cls8 Lng12 ";
  expect(allMatches(str, /Lng(\d+)/g, 1)).toEqual(["4", "32", "12"]);
});

test("fix all lower case", () => {
  expect(fixCaps("rick")).toEqual("Rick");
});

test("fix all uppercase", () => {
  expect(fixCaps("CONRAD")).toEqual("Conrad");
});

test("Don't fix mixed case", () => {
  expect(fixCaps("van den Berg")).toEqual("van den Berg");
});
