import { PartialModel } from "../models/TypeBucket";
import { IPerson } from "../models/Person";
import { ILanguage } from "../models/Language";
import { IOrganization } from "../models/Organization";
import { IParticipant } from "../models/Participant";
import { ICluster } from "../models/Cluster";
import { IRegion } from "../models/Region";
import { CanState } from "./canReducer";
import { IEvent } from "../models/Event";
import { IActivity } from "../models/Activity";

export interface LoadAction {
  type: "Load";
  payload: {
    people?: PartialModel<IPerson>[];
    languages?: PartialModel<ILanguage>[];
    clusters?: PartialModel<ICluster>[];
    regions?: PartialModel<IRegion>[];
    organizations?: PartialModel<IOrganization>[];
    participants?: PartialModel<IParticipant>[];
    events?: PartialModel<IEvent>[];
    deletedEvents?: number[];
    workshops_activities?: PartialModel<IActivity>[];
    can?: Partial<CanState>;
    // ... add more here
  };
}

export function loadAction(payload: LoadAction["payload"]): LoadAction {
  return { type: "Load", payload };
}

export function isLoadAction(action: any): action is LoadAction {
  return typeof action == "object" && action.type == "Load";
}
