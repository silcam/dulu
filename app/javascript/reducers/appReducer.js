import { combineReducers } from "redux";
import peopleReducer from "./peopleReducer";
import organizationsReducer from "./organizationsReducer";
import organizationPeopleReducer from "./organizationPeopleReducer";
import languagesReducer from "./languagesReducer";
import participantsReducer from "./participantsReducer";
import activitiesReducer from "./activitiesReducer";
import eventsReducer from "./eventsReducer";
import clustersReducer, { ClusterState } from "./clustersReducer";
import canReducer from "./canReducer";

// Find AppState interface in clustersReducer

const appReducer = combineReducers({
  languages: languagesReducer,
  clusters: clustersReducer,
  people: peopleReducer,
  organizations: organizationsReducer,
  organizationPeople: organizationPeopleReducer,
  participants: participantsReducer,
  activities: activitiesReducer,
  events: eventsReducer,
  can: canReducer
});

export default appReducer;
