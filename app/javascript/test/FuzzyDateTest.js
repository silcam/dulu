import assert from "assert";
import FuzzyDate from "../util/FuzzyDate";

testOverlapCompare();

function testOverlapCompare() {
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
  for (let i = 0; i < cases.zero.length; ++i) {
    let testCase = cases.zero[i];
    assert.equal(FuzzyDate.compare(testCase[0], testCase[1]), 0);
    assert.equal(FuzzyDate.compare(testCase[1], testCase[0]), 0);
  }
  for (let i = 0; i < cases.negative.length; ++i) {
    let testCase = cases.negative[i];
    assert(FuzzyDate.compare(testCase[0], testCase[1]) < 0);
    assert(FuzzyDate.compare(testCase[1], testCase[0]) > 0);
  }
}
