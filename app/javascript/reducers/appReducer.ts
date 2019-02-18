import { combineReducers } from "redux";
import peopleReducer, { PersonState } from "./peopleReducer";
import organizationsReducer, {
  OrganizationState
} from "./organizationsReducer";
import organizationPeopleReducer, {
  OrganizationPeopleState
} from "./organizationPeopleReducer";
import languagesReducer, { LanguageState } from "./languagesReducer";
import participantsReducer, { ParticipantState } from "./participantsReducer";
import activitiesReducer, { ActivityState } from "./activitiesReducer";
import eventsReducer, { EventState } from "./eventsReducer";
import clustersReducer, { ClusterState } from "./clustersReducer";
import canReducer, { CanState } from "./canReducer";
import regionsReducer, { RegionState } from "./regionsReducer";

export interface AppState {
  activities: ActivityState;
  can: CanState;
  clusters: ClusterState;
  events: EventState;
  languages: LanguageState;
  regions: RegionState;
  organizations: OrganizationState;
  organizationPeople: OrganizationPeopleState;
  participants: ParticipantState;
  people: PersonState;
}

const appReducer = combineReducers({
  languages: languagesReducer,
  clusters: clustersReducer,
  regions: regionsReducer,
  people: peopleReducer,
  organizations: organizationsReducer,
  organizationPeople: organizationPeopleReducer,
  participants: participantsReducer,
  activities: activitiesReducer,
  events: eventsReducer,
  can: canReducer
});

export default appReducer;
