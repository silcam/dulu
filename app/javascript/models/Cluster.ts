import { BasicModel } from "./BasicModel";
import { ILanguage, IParticipant } from "./TypeBucket";
import { AppState } from "../reducers/clustersReducer";
import { languageCompare } from "./language";

export interface ICluster extends BasicModel {
  can: { update?: boolean; destroy?: boolean; manage_participants?: boolean };
}

export interface IClusterInflated extends ICluster {
  languages: ILanguage[];
  participants: IParticipant[];
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
    languages: Object.values(state.languages.byId)
      .filter(l => l.cluster_id == cluster.id)
      .sort(languageCompare),
    participants: Object.values(state.participants).filter(
      p => p.cluster_id == cluster.id
    )
  };
}

export default {
  emptyCluster,
  compare,
  clusterParams,
  inflate
};
