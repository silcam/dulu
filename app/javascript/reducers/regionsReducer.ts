import Region, { IRegion } from "../models/Region";
import { stdReducers } from "./stdReducers";
import { RegionAction, RegionActionTypes } from "../actions/regionActions";

export interface RegionState {
  list: number[];
  byId: { [id: string]: IRegion | undefined };
}

const emptyState = {
  list: [],
  byId: {}
};

const stdRegionReducers = stdReducers(Region.emptyRegion, Region.compare);

export default function regionsReducer(
  state = emptyState,
  action: RegionAction
): RegionState {
  switch (action.type) {
    case RegionActionTypes.SetRegions:
      return stdRegionReducers.setList(action.regions!);
    case RegionActionTypes.SetRegion:
      return stdRegionReducers.addItems(state, [action.region!]);
    case RegionActionTypes.DeleteRegion:
      return stdRegionReducers.deleteItem(state, action.id!);
  }
  return state;
}
