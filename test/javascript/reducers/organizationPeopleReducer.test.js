import organizationPeopleReducer from "reducers/organizationPeopleReducer";
import {
  setOrganizationPerson,
  deleteOrganizationPerson,
  addOrganizationPeople
} from "../../../app/javascript/actions/organizationPeopleActions";

const op101 = { id: 101, person_id: 102, organization_id: 103 };
const op201 = { id: 201, person_id: 202, organization_id: 203 };
const op301 = { id: 301, person_id: 102, organization_id: 203 };
const initialState = {
  101: op101
};

test("empty state", () => {
  expect(organizationPeopleReducer(undefined, {})).toEqual({});
});

test("Add OP", () => {
  expect(
    organizationPeopleReducer(initialState, setOrganizationPerson(op201))
  ).toEqual({ 101: op101, 201: op201 });
});

test("Update OP", () => {
  const newOP101 = { id: 101, role: "Boss" };
  expect(
    organizationPeopleReducer(initialState, setOrganizationPerson(newOP101))
  ).toEqual({
    101: { ...op101, ...newOP101 }
  });
});

test("Add OPs", () => {
  expect(
    organizationPeopleReducer(
      initialState,
      addOrganizationPeople([op101, op301])
    )
  ).toEqual({
    101: op101,
    301: op301
  });
});

test("Delete OP", () => {
  expect(
    organizationPeopleReducer(initialState, deleteOrganizationPerson(101))
  ).toEqual({});
});
