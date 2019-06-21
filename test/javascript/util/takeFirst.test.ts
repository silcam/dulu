import takeFirst, {
  takeFirstNonBlank
} from "../../../app/javascript/util/takeFirst";

test("takeFirst returns first truthy value", () => {
  expect(takeFirst(null, undefined, "", { 4: 4 })).toEqual({ 4: 4 });
});

test("takeFirst returns last value if none are truthy", () => {
  expect(takeFirst(undefined, null, "")).toEqual("");
});

test("takeFirstNonBlank returns first string with non-whitespace char", () => {
  expect(takeFirstNonBlank("", " ", "\n\t", " Yeah!")).toEqual(" Yeah!");
});

test("takeFirstNonBlank returns last value if none match", () => {
  expect(takeFirst("", " ")).toEqual(" ");
});

test("takeFirstNonBlank rejects null and undefined", () => {
  expect(takeFirst(null, undefined, "yo")).toEqual("yo");
});
