import {
  allMatches,
  fixCaps,
  splitOnLastSpace
} from "../../../app/javascript/util/stringUtils";

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

test("Fix multiword", () => {
  expect(fixCaps("sil cameroon")).toEqual("Sil Cameroon");
});

test("Don't fix mixed case", () => {
  expect(fixCaps("van den Berg")).toEqual("van den Berg");
});

test("splitOnLastSpace", () => {
  expect(splitOnLastSpace("Three Word String")).toEqual([
    "Three Word",
    "String"
  ]);
  expect(splitOnLastSpace("Ending Space ")).toEqual(["Ending Space", ""]);
  expect(splitOnLastSpace("No-space")).toEqual(["No-space", ""]);
});
