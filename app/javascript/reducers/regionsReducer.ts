import Region, { IRegion } from "../models/Region";
import { RegionAction, RegionActionTypes } from "../actions/regionActions";
import List from "../models/List";

export default function regionsReducer(
  state = new List(Region.emptyRegion, [], Region.compare),
  action: RegionAction
): List<IRegion> {
  switch (action.type) {
    case RegionActionTypes.SetRegions:
      return state.addAndPrune(action.regions!);
    case RegionActionTypes.SetRegion:
      return state.add([action.region!]);
    case RegionActionTypes.DeleteRegion:
      return state.remove(action.id!);
  }
  return state;
}
