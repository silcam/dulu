import { stdReducersNoList } from "../../../app/javascript/reducers/stdReducers";
import { BasicModel } from "../../../app/javascript/models/BasicModel";

const emptyWidget: BasicModel = { id: 0, name: "" };

const stdWidgetReducers = stdReducersNoList(emptyWidget);

const w101 = { id: 101, name: "w-101" };
const modW101 = { id: 101, name: "z-mod-w-101" };
const w202 = { id: 202, name: "w-202" };
const w303 = { id: 303, name: "w-303" };
const initialState = {
  101: w101,
  303: w303
};

test("No List: ADD ITEMS to empty state", () => {
  const state = stdWidgetReducers.addItems({}, [w101, w303]);
  expect(state).toEqual(initialState);
});

test("No List: ADD ITEMS", () => {
  const state = stdWidgetReducers.addItems(initialState, [modW101, w202]);
  expect(state).toEqual({ 101: modW101, 202: w202, 303: w303 });
});

test("No List: DELETE Widget", () => {
  const state = stdWidgetReducers.deleteItem(initialState, 101);
  expect(state).toEqual({
    303: w303
  });
  expect(Object.keys(state).length).toBe(1); // Not reduntant - makes sure no key is SET to undefined
});

test("No List: DELETE nonexistant", () => {
  const state = stdWidgetReducers.deleteItem(initialState, 999);
  expect(state).toEqual(initialState);
});
