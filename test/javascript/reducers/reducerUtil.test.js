import { addItem, setItem } from "reducers/reducerUtil";

//***
//  See peopleReducer.test.js for the rests of the test for reducerUtil.js
//

const initialState = {
  list: [1, 2],
  byId: { 1: { id: 1, char: "1" }, 2: { id: 2, char: "2" } }
};

test("ADD ITEM no sort", () => {
  const state = addItem(initialState, { id: 0, char: "0" });
  expect(state.list).toEqual([1, 2, 0]);
  expect(state.byId[0]).toEqual({ id: 0, char: "0" });
});

test("SET ITEM no sort", () => {
  const state = setItem(initialState, { id: 1, char: "3" });
  expect(state.list).toBe(initialState.list);
  expect(state.list).toEqual([1, 2]);
  expect(state.byId[1]).toEqual({ id: 1, char: "3" });
});
