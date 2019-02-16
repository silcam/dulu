import { IRegion } from "../models/Region";

export enum RegionActionTypes {
  SetRegions = "SET_REGIONS",
  SetRegion = "SET_REGION",
  DeleteRegion = "DELETE_REGION"
}

export interface RegionAction {
  type: RegionActionTypes;
  regions?: IRegion[];
  region?: IRegion;
  id?: number;
}

export function setRegions(regions: IRegion[]): RegionAction {
  return {
    type: RegionActionTypes.SetRegions,
    regions
  };
}

export function setRegion(region: IRegion): RegionAction {
  return {
    type: RegionActionTypes.SetRegion,
    region
  };
}

export function deleteRegion(id: number): RegionAction {
  return {
    type: RegionActionTypes.DeleteRegion,
    id
  };
}
