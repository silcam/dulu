import peopleReducer from "reducers/peopleReducer";
import {
  setPeople,
  addPerson,
  setPerson,
  deletePerson,
  addPeople
} from "../../../app/javascript/actions/peopleActions";

test("empty state", () => {
  expect(peopleReducer(undefined, {})).toEqual({
    list: [],
    byId: {}
  });
});

const rick = { id: 101, first_name: "Rick", last_name: "Conrad" };
const fullRick = { ...rick, email: "rjc@gmail.com" };
const brian = { id: 202, first_name: "Brian", last_name: "Yee" };
const neil = { id: 303, first_name: "Neil", last_name: "Zubot" };
const peopleData = [rick, brian];

test("initial SET PEOPLE", () => {
  const state = peopleReducer(undefined, setPeople(peopleData));
  expect(state.list).toEqual([101, 202]);
  expect(state.byId[101]).toEqual({
    id: 101,
    first_name: "Rick",
    last_name: "Conrad"
  });
});

const initialState = {
  list: [101, 303],
  byId: {
    101: fullRick,
    303: neil
  }
};

test("subsequent SET PEOPLE", () => {
  const state = peopleReducer(initialState, setPeople(peopleData));
  expect(state.list).toEqual([101, 202]);
  expect(state.byId).toEqual({
    101: fullRick,
    202: brian
  });
});

test("ADD PEOPLE", () => {
  const state = peopleReducer(initialState, addPeople(peopleData));
  expect(state.list).toEqual([101, 202, 303]);
  expect(state.byId).toEqual({
    101: fullRick,
    202: brian,
    303: neil
  });
});

test("ADD PERSON", () => {
  const state = peopleReducer(initialState, addPerson(brian));
  expect(state.list).toEqual([101, 202, 303]);
  expect(state.byId[202]).toEqual(brian);
});

test("ADD PERSON to empty state", () => {
  const state = peopleReducer(undefined, addPerson(brian));
  expect(state.list).toEqual([202]);
  expect(state.byId).toEqual({ 202: brian });
});

test("SET PERSON to empty state", () => {
  const state = peopleReducer(undefined, setPerson(brian));
  expect(state.list).toEqual([202]);
  expect(state.byId).toEqual({ 202: brian });
});

test("SET PERSON", () => {
  const updatedNeil = { id: 303, last_name: "Applegate" };
  const state = peopleReducer(initialState, setPerson(updatedNeil));
  expect(state.list).toEqual([303, 101]);
  expect(state.byId[303]).toEqual({
    id: 303,
    first_name: "Neil",
    last_name: "Applegate"
  });
  expect(state.byId[303]).not.toBe(updatedNeil);
});

test("DELETE PERSON", () => {
  const state = peopleReducer(initialState, deletePerson(101));
  expect(state.list).toEqual([303]);
  expect(state.byId).toEqual({
    303: neil
  });
});

test("DELETE nonexistant PERSON", () => {
  expect(peopleReducer(initialState, deletePerson(4321))).toBe(initialState);
});
