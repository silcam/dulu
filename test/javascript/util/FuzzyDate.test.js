import FuzzyDate from "util/FuzzyDate";
import MockDate from "mockdate";

test("Now!", () => {
  MockDate.set(new Date(1776, 6, 4));
  expect(FuzzyDate.today()).toEqual("1776-07-04");
  MockDate.reset();
});

const cases = {
  zero: [
    ["2018", "2018"],
    ["2018-01", "2018"],
    ["2018", "2018-07-06"],
    ["2018-07", "2018-07"],
    ["2018-07-07", "2018-07"],
    ["2018-06", "2018-06-05"],
    ["2018-04-05", "2018-04-05"]
  ],
  negative: [
    ["2017", "2018"],
    ["2017-12-31", "2018"],
    ["2018-06", "2018-07"],
    ["2018-06-30", "2018-07-01"],
    ["2018-10-5", "2018-10-6"]
  ]
};
test("Compare!", () => {
  for (let i = 0; i < cases.zero.length; ++i) {
    let testCase = cases.zero[i];
    expect(FuzzyDate.compare(testCase[0], testCase[1])).toBe(0);
    expect(FuzzyDate.compare(testCase[1], testCase[0])).toBe(0);
  }
  for (let i = 0; i < cases.negative.length; ++i) {
    let testCase = cases.negative[i];
    expect(FuzzyDate.compare(testCase[0], testCase[1])).toBeLessThan(0);
    expect(FuzzyDate.compare(testCase[1], testCase[0])).toBeGreaterThan(0);
  }
});

test("toObject with just year", () => {
  expect(FuzzyDate.toObject("2019")).toEqual({ year: 2019 });
});

test("toObject with full Date", () => {
  expect(FuzzyDate.toObject("2019-01-25")).toEqual({
    year: 2019,
    month: 1,
    day: 25
  });
});

test("some toString's", () => {
  let date = { year: 2019 };
  expect(FuzzyDate.toString(date)).toEqual("2019");
  date.month = 2;
  expect(FuzzyDate.toString(date)).toEqual("2019-02");
  date.day = 10;
  expect(FuzzyDate.toString(date)).toEqual("2019-02-10");
});
