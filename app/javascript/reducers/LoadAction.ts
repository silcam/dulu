import { PartialModel } from "../models/TypeBucket";
import { IPerson } from "../models/Person";
import { ILanguage } from "../models/Language";
import { IOrganization, IOrganizationPerson } from "../models/Organization";
import { IParticipant } from "../models/Participant";
import { ICluster } from "../models/Cluster";
import { IRegion } from "../models/Region";
import { CanState } from "./canReducer";
import { IEvent } from "../models/Event";
import { IActivity } from "../models/Activity";

export interface LoadAction {
  type: "Load";
  payload: {
    activities?: PartialModel<IActivity>[];
    people?: PartialModel<IPerson>[];
    deletedPeople?: number[];
    languages?: PartialModel<ILanguage>[];
    clusters?: PartialModel<ICluster>[];
    deletedClusters?: number[];
    regions?: PartialModel<IRegion>[];
    deletedRegions?: number[];
    organizations?: PartialModel<IOrganization>[];
    deletedOrganizations?: number[];
    organizationPeople?: PartialModel<IOrganizationPerson>[];
    deletedOrganizationPeople?: number[];
    participants?: PartialModel<IParticipant>[];
    deletedParticipants?: number[];
    events?: PartialModel<IEvent>[];
    deletedEvents?: number[];
    can?: Partial<CanState>;
  };
}

export function loadAction(payload: LoadAction["payload"]): LoadAction {
  return { type: "Load", payload };
}

export function isLoadAction(action: any): action is LoadAction {
  return typeof action == "object" && action.type == "Load";
}
