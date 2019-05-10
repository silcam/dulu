import { combineReducers } from "redux";
import peopleReducer from "./peopleReducer";
import organizationsReducer from "./organizationsReducer";
import organizationPeopleReducer from "./organizationPeopleReducer";
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
import { IPerson } from "../models/Person";
import { IOrganization, IOrganizationPerson } from "../models/Organization";

export interface AppState {
  activities: ActivityState;
  can: CanState;
  clusters: List<ICluster>;
  events: EventState;
  languages: List<ILanguage>;
  regions: List<IRegion>;
  organizations: List<IOrganization>;
  organizationPeople: List<IOrganizationPerson>;
  participants: ParticipantState;
  people: List<IPerson>;
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
