import dateString from "util/dateString";
import { monthNames } from "../testUtil";
const months = monthNames();

test("dateString format year only", () => {
  expect(dateString("2019", months)).toEqual("2019");
});

test("dateString format year-month", () => {
  expect(dateString("2019-02", months)).toEqual("Feb 2019");
});

test("dateString formats full date", () => {
  expect(dateString("2019-02-22", months)).toEqual("22 Feb 2019");
});

test("dateString with blank input", () => {
  expect(dateString(undefined, months)).toEqual("");
});
