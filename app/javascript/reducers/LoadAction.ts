import { PartialModel } from "../models/TypeBucket";
import { IPerson } from "../models/Person";

export interface LoadAction {
  type: "Load";
  payload: {
    people?: PartialModel<IPerson>[];
    person?: PartialModel<IPerson>;
    // ... add more here
  };
}

export function loadAction(payload: LoadAction["payload"]): LoadAction {
  return { type: "Load", payload };
}

export function isLoadAction(action: any): action is LoadAction {
  return typeof action == "object" && action.type == "Load";
}
