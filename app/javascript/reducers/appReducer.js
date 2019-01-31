import { combineReducers } from "redux";
import peopleReducer from "../../../app/javascript/reducers/peopleReducer";
import organizationsReducer from "./organizationsReducer";
import organizationPeopleReducer from "./organizationPeopleReducer";

const appReducer = combineReducers({
  people: peopleReducer,
  organizations: organizationsReducer,
  organizationPeople: organizationPeopleReducer
});

export default appReducer;
