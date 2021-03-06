import { IPerson } from "./Person";
import { ICluster } from "./Cluster";
import { ILanguage } from "./Language";
import { AppState } from "../reducers/appReducer";
import List from "./List";

export interface IRegion {
  id: number;
  name: string;
  lpf_id?: number;
  can: { update?: boolean; destroy?: boolean };
}

export interface IRegionInflated extends IRegion {
  lpf?: IPerson;
  clusters: List<ICluster>;
  languages: List<ILanguage>;
}

const emptyRegion: IRegion = {
  id: 0,
  name: "",
  can: {}
};

function compare(a: IRegion, b: IRegion) {
  return a.name.localeCompare(b.name);
}

function regionParams(region: IRegionInflated) {
  return {
    name: region.name,
    lpf_id: region.lpf ? region.lpf.id : null,
    cluster_ids: region.clusters.map(cluster => cluster.id),
    language_ids: region.languages.map(language => language.id)
  };
}

function inflate(state: AppState, region: IRegion): IRegionInflated {
  return {
    ...region,
    lpf: region.lpf_id ? state.people.get(region.lpf_id) : undefined,
    clusters: state.clusters.filter(c => c.region_id == region.id),
    languages: state.languages.filter(l => l.region_id == region.id)
  };
}

function clusters(state: AppState, regionId: number) {
  return state.clusters.filter(c => c.region_id == regionId);
}

function languages(state: AppState, regionId: number) {
  return state.languages.filter(lang => lang.region_id == regionId);
}

function emptyList() {
  return new List(emptyRegion, [], compare);
}

export default {
  emptyRegion,
  compare,
  regionParams,
  inflate,
  clusters,
  languages,
  emptyList
};
