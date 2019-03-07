import ifDef from "../../../app/javascript/util/ifDef";

const hasFoo = { foo: "yup" };
const nullFoo = { foo: null };
const noFoo: { foo?: string; bar: string } = { bar: "not foo" };

test("ifDef returns the result of the callback if the first argument is defined and not null", () => {
  expect(ifDef(hasFoo.foo, foo => `foo: ${foo}`)).toEqual("foo: yup");
});

test("ifDef returns 3rd arg if 1st arg is null", () => {
  expect(ifDef(nullFoo.foo, foo => foo, "??")).toEqual("??");
});

test("ifDef return 3rd arg if 1st arg is undefined", () => {
  expect(ifDef(noFoo.foo, foo => foo, "??")).toEqual("??");
});

test("ifDef returns empty string if 1st not defined and no 3rd provided", () => {
  expect(ifDef(undefined, () => 4)).toEqual("");
});
