import { stdReducers } from "../../../app/javascript/reducers/stdReducers";
import { BasicModel } from "../../../app/javascript/models/BasicModel";
import baseCompare from "../../../app/javascript/util/baseCompare";

const emptyWidget: BasicModel = { id: 0, name: "" };
const compare = (a: BasicModel, b: BasicModel) => baseCompare(a.name, b.name);

const stdWidgetReducers = stdReducers(emptyWidget, compare);

const w101 = { id: 101, name: "w-101" };
// const fullRick = { ...rick, email: "rjc@gmail.com" };
// const brian = { id: 202, first_name: "Brian", last_name: "Yee" };
const w303 = { id: 303, name: "w-303" };
const initialState = {
  list: [101, 303],
  byId: {
    101: w101,
    303: w303
  }
};

test("DELETE Widget", () => {
  const state = stdWidgetReducers.deleteItem(initialState, 101);
  expect(state.list).toEqual([303]);
  expect(state.byId).toEqual({
    303: w303
  });
  expect(Object.keys(state.byId).length).toBe(1);
});
