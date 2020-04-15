import Region, { IRegion } from "../models/Region";
import List from "../models/List";
import { isLoadAction } from "./LoadAction";
import { Action } from "redux";

export default function regionsReducer(
  state = new List(Region.emptyRegion, [], Region.compare),
  action: Action
): List<IRegion> {
  if (isLoadAction(action)) {
    return state
      .add(action.payload.regions)
      .remove(action.payload.deletedRegions);
  }
  return state;
}
