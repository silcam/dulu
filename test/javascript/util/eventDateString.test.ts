import { monthNames } from "../testUtil";
import eventDateString from "../../../app/javascript/util/eventDateString";
const months = monthNames();

test("eventDateString with one date", () => {
  expect(eventDateString("2019-01-25", "2019-01-25", months)).toEqual(
    "25 Jan 2019"
  );
});

test("eventDateString with two dates", () => {
  expect(eventDateString("2019-01-25", "2019-01-31", months)).toEqual(
    "25 Jan 2019 - 31 Jan 2019"
  );
});
