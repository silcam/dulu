import { combineReducers } from "redux";
import peopleReducer from "../../../app/javascript/reducers/peopleReducer";

const appReducer = combineReducers({
  people: peopleReducer
});

export default appReducer;
