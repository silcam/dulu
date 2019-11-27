import { allMatches } from "../../../app/javascript/util/stringUtils";

test("allMatches", () => {
  const str = "Lng4 DTra Lng32 Cls8 Lng12 ";
  expect(allMatches(str, /Lng(\d+)/g, 1)).toEqual(["4", "32", "12"]);
});
