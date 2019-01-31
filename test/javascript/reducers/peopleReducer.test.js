import peopleReducer from "reducers/peopleReducer";
import {
  setPeople,
  addPerson,
  setPerson,
  deletePerson
} from "../../../app/javascript/actions/peopleActions";

test("empty state", () => {
  expect(peopleReducer(undefined, {})).toEqual({
    peopleIds: [],
    peopleById: {}
  });
});

const rick = { id: 101, first_name: "Rick", last_name: "Conrad" };
const fullRick = { ...rick, email: "rjc@gmail.com" };
const brian = { id: 202, first_name: "Brian", last_name: "Yee" };
const neil = { id: 303, first_name: "Neil", last_name: "Zubot" };
const peopleData = [rick, brian];

test("initial SET PEOPLE", () => {
  const state = peopleReducer(undefined, setPeople(peopleData));
  expect(state.peopleIds).toEqual([101, 202]);
  expect(state.peopleById[101]).toEqual({
    id: 101,
    first_name: "Rick",
    last_name: "Conrad"
  });
});

const initialState = {
  peopleIds: [101, 303],
  peopleById: {
    101: fullRick,
    303: neil
  }
};

test("subsequent SET PEOPLE", () => {
  const state = peopleReducer(initialState, setPeople(peopleData));
  expect(state.peopleIds).toEqual([101, 202]);
  expect(state.peopleById).toEqual({
    101: fullRick,
    202: brian
  });
});

test("ADD PERSON", () => {
  const state = peopleReducer(initialState, addPerson(brian));
  expect(state.peopleIds).toEqual([101, 202, 303]);
  expect(state.peopleById[202]).toEqual(brian);
});

test("SET PERSON", () => {
  const state = peopleReducer(
    initialState,
    setPerson({ id: 303, last_name: "Applegate" })
  );
  expect(state.peopleIds).toEqual([303, 101]);
  expect(state.peopleById[303]).toEqual({
    id: 303,
    first_name: "Neil",
    last_name: "Applegate"
  });
});

test("DELETE PERSON", () => {
  const state = peopleReducer(initialState, deletePerson(101));
  expect(state.peopleIds).toEqual([303]);
  expect(state.peopleById).toEqual({
    303: neil
  });
});

test("DELETE nonexistant PERSON", () => {
  expect(peopleReducer(initialState, deletePerson(4321))).toBe(initialState);
});
