import takeFirst from "../../../app/javascript/util/takeFirst";

test("takeFirst returns first truthy value", () => {
  expect(takeFirst(null, undefined, "", { 4: 4 })).toEqual({ 4: 4 });
});

test("takeFirst returns last value if none are truthy", () => {
  expect(takeFirst(undefined, null, "")).toEqual("");
});
