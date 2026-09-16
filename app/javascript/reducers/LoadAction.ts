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

// A `type`, not an `interface`, and the distinction is load-bearing since redux 5:
// `dispatch` now takes `UnknownAction`, which carries an index signature
// (`[extraProps: string]: unknown`). TypeScript gives an object type alias an
// implicit index signature but never gives one to an interface, so as an
// interface this failed to dispatch while every other action in the app -- all
// of them type aliases -- passed. Nothing else about the shape changed.
export type LoadAction = {
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

// `unknown`, because narrowing something already typed `any` is what this guard exists to
// avoid. The null check is not ceremony: `typeof null == "object"`, so the old body would
// throw on isLoadAction(null) rather than return false.
export function isLoadAction(action: unknown): action is LoadAction {
  return (
    typeof action == "object" &&
    action !== null &&
    (action as { type?: unknown }).type == "Load"
  );
}
