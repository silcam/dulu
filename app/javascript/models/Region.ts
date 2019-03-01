import { IPerson } from "./Person";
import { ICluster } from "./Cluster";
import { ILanguage } from "./Language";
import { AppState } from "../reducers/appReducer";

export interface IRegion {
  id: number;
  name: string;
  person_id?: number;
  can: { update?: boolean; destroy?: boolean };
}

export interface IRegionInflated extends IRegion {
  person?: IPerson;
  clusters: ICluster[];
  languages: ILanguage[];
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
    person_id: region.person ? region.person.id : undefined,
    cluster_ids: region.clusters.map(cluster => cluster.id),
    language_ids: region.languages.map(language => language.id)
  };
}

function inflate(state: AppState, region: IRegion): IRegionInflated {
  return {
    ...region,
    person: region.person_id ? state.people.byId[region.person_id] : undefined,
    clusters: state.clusters.list
      .map(id => state.clusters.byId[id])
      .filter(c => c!.region_id == region.id) as ICluster[],
    languages: state.languages.list
      .map(id => state.languages.byId[id])
      .filter(l => l!.region_id == region.id) as ILanguage[]
  };
}

function clusters(state: AppState, regionId: number) {
  return (Object.values(state.clusters.byId) as ICluster[]).filter(
    c => c.region_id == regionId
  );
}

function languages(state: AppState, regionId: number) {
  return (Object.values(state.languages.byId) as ILanguage[]).filter(
    lang => lang.region_id == regionId
  );
}

export default {
  emptyRegion,
  compare,
  regionParams,
  inflate,
  clusters,
  languages
};
