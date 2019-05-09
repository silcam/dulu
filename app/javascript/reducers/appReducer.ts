import { combineReducers } from "redux";
import peopleReducer, { PersonState } from "./peopleReducer";
import organizationsReducer, {
  OrganizationState
} from "./organizationsReducer";
import organizationPeopleReducer, {
  OrganizationPeopleState
} from "./organizationPeopleReducer";
import languagesReducer from "./languagesReducer";
import participantsReducer, { ParticipantState } from "./participantsReducer";
import activitiesReducer, { ActivityState } from "./activitiesReducer";
import eventsReducer, { EventState } from "./eventsReducer";
import clustersReducer from "./clustersReducer";
import canReducer, { CanState } from "./canReducer";
import regionsReducer from "./regionsReducer";
import List from "../models/List";
import { IRegion } from "../models/Region";
import { ICluster } from "../models/Cluster";
import { ILanguage } from "../models/Language";

export interface AppState {
  activities: ActivityState;
  can: CanState;
  clusters: List<ICluster>;
  events: EventState;
  languages: List<ILanguage>;
  regions: List<IRegion>;
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
