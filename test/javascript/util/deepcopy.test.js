import deepcopy from "util/deepcopy";

test("deepcopy", () => {
  const obj = {
    deep: {
      nesting: [
        1,
        2,
        3,
        {
          yo: "yo"
        }
      ],
      cool: "beans"
    }
  };
  const newObj = deepcopy(obj);
  expect(newObj).toEqual(obj);
  expect(newObj).not.toBe(obj);
});
