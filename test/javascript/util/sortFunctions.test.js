import {
  sortActivities,
  languageSort,
  stageSort,
  lastUpdateSort,
  nameSort
} from "util/sortFunctions";

const oneActivity = {
  progress: { percent: 30 },
  last_update: "2019-01-25",
  name: "OneActivity"
};

const anotherActivity = {
  progress: { percent: 80 },
  last_update: "2018-11-30",
  name: "AnotherActivity"
};

test("sortActivities asc", () => {
  // postponeFailure(new Date(2019, 1, 1));
  expect(
    sortActivities(
      { option: "name", asc: true },
      [oneActivity, anotherActivity],
      { name: nameSort }
    )
  ).toEqual([anotherActivity, oneActivity]);
});

test("sortActivities desc", () => {
  expect(
    sortActivities(
      { option: "name", asc: false },
      [oneActivity, anotherActivity],
      { name: nameSort }
    )
  ).toEqual([oneActivity, anotherActivity]);
});

test("languageSort", () => {
  expect(
    languageSort({ language_name: "French" }, { language_name: "English" })
  ).toBeGreaterThan(0);
});

test("Stage Sort", () => {
  expect(stageSort(oneActivity, anotherActivity)).toBeLessThan(0);
});

test("Last update sort", () => {
  expect(lastUpdateSort(oneActivity, anotherActivity)).toBeGreaterThan(0);
});

test("name sort", () => {
  expect(nameSort(oneActivity, anotherActivity)).toBeGreaterThan(0);
});
