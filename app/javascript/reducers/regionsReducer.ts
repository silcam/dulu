import Region, { IRegion } from "../models/Region";
import { stdReducers, State } from "./stdReducers";
import { RegionAction, RegionActionTypes } from "../actions/regionActions";

export type RegionState = State<IRegion>;

const emptyState: RegionState = {
  list: [],
  byId: {},
  listSet: false
};

const stdRegionReducers = stdReducers(Region.emptyRegion, Region.compare);

export default function regionsReducer(
  state = emptyState,
  action: RegionAction
): RegionState {
  switch (action.type) {
    case RegionActionTypes.SetRegions:
      return stdRegionReducers.setList(state, action.regions!);
    case RegionActionTypes.SetRegion:
      return stdRegionReducers.addItems(state, [action.region!]);
    case RegionActionTypes.DeleteRegion:
      return stdRegionReducers.deleteItem(state, action.id!);
  }
  return state;
}
