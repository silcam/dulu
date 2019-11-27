import DuluAxios from "../../util/DuluAxios";
import Region, { IRegionInflated, IRegion } from "../../models/Region";
import {
  Adder,
  Setter,
  Deleter,
  AnyObj,
  SetCan
} from "../../models/TypeBucket";
import { ICluster } from "../../models/Cluster";
import { ILanguage } from "../../models/Language";

interface FetchRegionActions {
  addClusters: Adder<ICluster>;
  addLanguages: Adder<ILanguage>;
  setRegion: Setter<IRegion>;
}

async function fetchAll(setRegions: Adder<IRegion>, setCan: SetCan) {
  const data = await DuluAxios.get("/api/regions");
  if (data) {
    setRegions(data.regions);
    setCan("regions", data.can);
  }
}

async function fetch(id: number, actions: FetchRegionActions) {
  const data = await DuluAxios.get(`/api/regions/${id}`);
  if (data) {
    fetchedRegion(data, actions);
  }
}

async function create(region: AnyObj, actions: FetchRegionActions) {
  const data = await DuluAxios.post(`/api/regions`, { region: region });
  if (data) {
    fetchedRegion(data, actions);
    return data.region;
  }
}

async function update(region: IRegionInflated, actions: FetchRegionActions) {
  const data = await DuluAxios.put(`/api/regions/${region.id}`, {
    region: Region.regionParams(region)
  });
  if (data) {
    fetchedRegion(data, actions);
    return data.region;
  }
}

async function del(id: number, deleteRegionAction: Deleter) {
  const deleted = await DuluAxios.delete(`/api/regions/${id}`);
  if (deleted) {
    deleteRegionAction(id);
    return true;
  }
}

function fetchedRegion(data: AnyObj, actions: FetchRegionActions) {
  if (data.languages) actions.addLanguages(data.languages);
  if (data.clusters) actions.addClusters(data.clusters);
  actions.setRegion(data.region);
}

export default {
  fetchAll,
  fetch,
  create,
  update,
  delete: del
};
