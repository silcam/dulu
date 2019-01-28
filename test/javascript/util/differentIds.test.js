import differentIds from "util/differentIds";

const french = {
  id: 123,
  name: "French"
};
const francais = {
  id: 123,
  name: "Français"
};
const english = {
  id: 321,
  name: "English"
};

test("diffIds: french and english are different", () => {
  expect(differentIds(french, english)).toBe(true);
});

test("diffIds: french and francais are the same", () => {
  expect(differentIds(french, francais)).toBe(false);
});

test("diffIds: french different from null", () => {
  expect(differentIds(french, null)).toBe(true);
});

test("diffIds: undefined different from english", () => {
  expect(differentIds(undefined, english)).toBe(true);
});

test("diffIds: null and undefined have the same id", () => {
  expect(differentIds(null, undefined)).toBe(false);
});
