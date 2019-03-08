import { stdReducers } from "../../../app/javascript/reducers/stdReducers";
import { BasicModel } from "../../../app/javascript/models/BasicModel";
import baseCompare from "../../../app/javascript/util/baseCompare";

const emptyWidget: BasicModel = { id: 0, name: "" };
const compare = (a: BasicModel, b: BasicModel) => baseCompare(a.name, b.name);

const stdWidgetReducers = stdReducers(emptyWidget, compare);

const w101 = { id: 101, name: "w-101" };
const modW101 = { id: 101, name: "z-mod-w-101" };
const w202 = { id: 202, name: "w-202" };
const w303 = { id: 303, name: "w-303" };
const initialState = {
  list: [101, 303],
  byId: {
    101: w101,
    303: w303
  },
  listSet: true
};

test("initial SET LIST", () => {
  const state = stdWidgetReducers.setList(
    { list: [], byId: {}, listSet: false },
    [w101, w202]
  );
  expect(state.list).toEqual([101, 202]);
  expect(state.byId).toEqual({ 101: w101, 202: w202 });
  expect(state.listSet).toBe(true);
});

test("subsequent SET LIST", () => {
  const state = stdWidgetReducers.setList(initialState, [w101, w202]);
  expect(state.list).toEqual([101, 202]);
  expect(state.byId).toEqual({ 101: w101, 202: w202 });
});

test("ADD ITEMS to empty state", () => {
  const state = stdWidgetReducers.addItems(
    { list: [], byId: {}, listSet: false },
    [w101, w303]
  );
  expect(state).toEqual({
    list: [101, 303],
    byId: {
      101: w101,
      303: w303
    },
    listSet: false
  });
});

test("ADD ITEMS", () => {
  const state = stdWidgetReducers.addItems(initialState, [modW101, w202]);
  expect(state.list).toEqual([202, 303, 101]);
  expect(state.byId).toEqual({ 101: modW101, 202: w202, 303: w303 });
});

test("DELETE Widget", () => {
  const state = stdWidgetReducers.deleteItem(initialState, 101);
  expect(state.list).toEqual([303]);
  expect(state.byId).toEqual({
    303: w303
  });
  expect(Object.keys(state.byId).length).toBe(1); // Not reduntant - makes sure no key is SET to undefined
});

test("DELETE nonexistant", () => {
  const state = stdWidgetReducers.deleteItem(initialState, 999);
  expect(state).toEqual(initialState);
});

const w404 = { id: 404, name: "w404" };
const wPartial = JSON.parse(JSON.stringify({ id: 404 })); // Name is not set

test("SET uses empty item as base", () => {
  const state = stdWidgetReducers.setList(initialState, [wPartial]);
  expect(state.byId[404]).toEqual({ id: 404, name: "" });
});

test("ADD uses empty item as base", () => {
  const state = stdWidgetReducers.addItems(
    { list: [], byId: {}, listSet: false },
    [wPartial]
  );
  expect(state.byId[404]).toEqual({ id: 404, name: "" });
});

test("SET with partial does not override exisiting params", () => {
  const state = stdWidgetReducers.setList(
    { list: [404], byId: { 404: w404 }, listSet: false },
    [wPartial]
  );
  expect(state.byId[404]).toEqual({ id: 404, name: "w404" });
});

test("ADD with partial does not override exisiting params", () => {
  const state = stdWidgetReducers.addItems(
    { list: [404], byId: { 404: w404 }, listSet: false },
    [wPartial]
  );
  expect(state.byId[404]).toEqual({ id: 404, name: "w404" });
});
