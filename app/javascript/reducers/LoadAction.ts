import { PartialModel } from "../models/TypeBucket";
import { IPerson } from "../models/Person";
import { ILanguage } from "../models/Language";
import { IOrganization } from "../models/Organization";

export interface LoadAction {
  type: "Load";
  payload: {
    people?: PartialModel<IPerson>[];
    person?: PartialModel<IPerson>; // Remove
    languages?: PartialModel<ILanguage>[];
    organizations?: PartialModel<IOrganization>[];
    // ... add more here
  };
}

export function loadAction(payload: LoadAction["payload"]): LoadAction {
  return { type: "Load", payload };
}

export function isLoadAction(action: any): action is LoadAction {
  return typeof action == "object" && action.type == "Load";
}
