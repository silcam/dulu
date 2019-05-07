import Event from "models/Event";
import MockDate from "mockdate";
import update from "immutability-helper";

const christmas = { start_date: "2018-12-25", end_date: "2018-12-25" };
const decemberMonth = { start_date: "2018-12", end_date: "2018-12" };
const january = { start_date: "2019-01-01", end_date: "2019-01-31" };
const twentyNineteen = { start_date: "2019", end_date: "2019" };
const newYears = { start_date: "2019-01-01", end_date: "2019-01-01" };

test("domainEvents", () => {
  const allEvents = [{ domain: "Translation" }, { domain: "Literacy" }];
  expect(Event.domainEvents(allEvents, "Literacy")).toEqual([
    { domain: "Literacy" }
  ]);
});

test("some comparisons", () => {
  expect(Event.compare(christmas, decemberMonth)).toBeGreaterThan(0);
  expect(Event.compare(january, twentyNineteen)).toBeGreaterThan(0);
  expect(Event.compare(newYears, january)).toBeLessThan(0);
  expect(Event.revCompare(newYears, january)).toBeGreaterThan(0);
});

test("isPastCurrentFuture", () => {
  MockDate.set(new Date(2018, 11, 31)); // New Year's Eve
  expect(Event.isPastCurrentFuture(christmas)).toBeLessThan(0);
  expect(Event.isPastCurrentFuture(decemberMonth)).toBe(0);
  expect(Event.isPastCurrentFuture(january)).toBeGreaterThan(0);
  expect(Event.isPastCurrentFuture(twentyNineteen)).toBeGreaterThan(0);
  expect(Event.isPastCurrentFuture(newYears)).toBeGreaterThan(0);
  MockDate.reset();
});

test("some overlap comparisons", () => {
  expect(Event.overlapCompare(christmas, decemberMonth)).toBe(0);
  expect(Event.overlapCompare(decemberMonth, january)).toBeLessThan(0);
  expect(Event.overlapCompare(twentyNineteen, january)).toBe(0);
  expect(Event.overlapCompare(twentyNineteen, decemberMonth)).toBeGreaterThan(
    0
  );
  expect(Event.overlapCompare(newYears, christmas)).toBeGreaterThan(0);
});

test("some comparison events", () => {
  let period = { start: { year: 2018, month: 2 } };
  let exp = { start_date: "2018-02", end_date: "9999" };
  expect(Event.comparisonEvent(period)).toEqual(exp);
  period.end = { year: "2020" };
  exp.end_date = "2020";
  expect(Event.comparisonEvent(period)).toEqual(exp);
  period.start = undefined;
  exp.start_date = "0000";
  expect(Event.comparisonEvent(period)).toEqual(exp);
});

test("some month overlap checks", () => {
  expect(Event.overlapsMonth(christmas, 2018, 11)).toBe(false);
  expect(Event.overlapsMonth(christmas, 2018, 12)).toBe(true);
  expect(Event.overlapsMonth(christmas, 2019, 1)).toBe(false);
  expect(Event.overlapsMonth(decemberMonth, 2018, 11)).toBe(false);
  expect(Event.overlapsMonth(decemberMonth, 2018, 12)).toBe(true);
  expect(Event.overlapsMonth(decemberMonth, 2019, 1)).toBe(false);
  expect(Event.overlapsMonth(twentyNineteen, 2018, 12)).toBe(false);
  expect(Event.overlapsMonth(twentyNineteen, 2019, 1)).toBe(true);
  expect(Event.overlapsMonth(twentyNineteen, 2020, 1)).toBe(false);
});

test("some overlaps year checks", () => {
  expect(Event.overlapsYear(christmas, 2017)).toBe(false);
  expect(Event.overlapsYear(decemberMonth, 2018)).toBe(true);
  expect(Event.overlapsYear(twentyNineteen, 2010)).toBe(false);
});

test("prepareEventParams", () => {
  const event = {
    name: "My Event",
    clusters: [{ id: 101 }, { id: 202 }],
    languages: [{ id: 303 }, { id: 404 }],
    event_participants: [{ id: 505 }, { id: 606 }]
  };
  const oldEventParticipants = event.event_participants.concat([{ id: 707 }]);

  // First without oldEvent
  let params = Event.prepareEventParams(event);
  expect(params.name).toEqual("My Event");
  expect(params.cluster_ids).toEqual([101, 202]);
  expect(params.language_ids).toEqual([303, 404]);
  expect(params.event_participants_attributes).toEqual({
    0: { id: 505 },
    1: { id: 606 }
  });

  // Now with oldEvent
  params = Event.prepareEventParams(event, oldEventParticipants);
  expect(params.event_participants_attributes).toEqual({
    0: { id: 505 },
    1: { id: 606 },
    2: { id: 707, _destroy: true }
  });
});
