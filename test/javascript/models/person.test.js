import * as Person from "models/person";

test("personCompare", () => {
  const rick = { first_name: "Rick", last_name: "Conrad" };
  const brian = { first_name: "Brian", last_name: "Yee" };
  const chelsea = { first_name: "Chelsea", last_name: "Conrad" };
  expect(Person.personCompare(rick, brian)).toBeLessThan(0);
  expect(Person.personCompare(rick, chelsea)).toBeGreaterThan(0);
});

test("same name?", () => {
  expect(
    Person.sameName(
      { first_name: "rick", last_name: "conrâd" },
      { first_name: "Rick", last_name: "Conrad" }
    )
  ).toBe(true);

  expect(
    Person.sameName(
      { first_name: "Richard", last_name: "Conrad" },
      { first_name: "Rick", last_name: "Conrad" }
    )
  ).toBe(false);
});
