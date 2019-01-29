import * as Person from "models/person";

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
