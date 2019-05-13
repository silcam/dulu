import { BasicModel } from "./BasicModel";
import { IParticipant } from "./Participant";
import { AppState } from "../reducers/appReducer";
import { ILanguage } from "./Language";
import List from "./List";

export interface ICluster extends BasicModel {
  can: { update?: boolean; destroy?: boolean; manage_participants?: boolean };
  region_id?: number;
}

export interface IClusterInflated extends ICluster {
  languages: List<ILanguage>;
  participants: List<IParticipant>;
}

const emptyCluster = {
  id: 0,
  name: "",
  language_ids: [],
  can: {}
};

function compare(a: BasicModel, b: BasicModel) {
  return a.name.localeCompare(b.name);
}

function clusterParams(cluster: IClusterInflated) {
  return {
    name: cluster.name,
    language_ids: cluster.languages.map(language => language.id)
  };
}

function inflate(state: AppState, cluster: ICluster): IClusterInflated {
  return {
    ...cluster,
    languages: state.languages.filter(l => l.cluster_id == cluster.id),
    participants: state.participants.filter(p => p.cluster_id == cluster.id)
  };
}

function languages(state: AppState, clusterId: number) {
  return state.languages.filter(lang => lang.cluster_id == clusterId);
}

export default {
  emptyCluster,
  compare,
  clusterParams,
  inflate,
  languages
};
