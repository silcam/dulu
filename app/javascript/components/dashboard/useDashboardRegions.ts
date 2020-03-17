import { ILanguage } from "../../models/Language";
import { ICluster } from "../../models/Cluster";
import { IRegion } from "../../models/Region";
import List from "../../models/List";
import useAppSelector from "../../reducers/useAppSelector";

export interface LoadedCluster extends ICluster {
  languages: List<ILanguage>;
}

export interface LoadedRegion extends IRegion {
  clusters: List<LoadedCluster>;
  languages: List<ILanguage>;
}

export default function useDashboardRegions() {
  const user = useAppSelector(state => state.currentUser);
  const languages = useAppSelector(state => state.languages);
  const clusters: List<LoadedCluster> = useAppSelector(
    state => state.clusters
  ).mapToList(cl => ({
    ...cl,
    languages: languages.filter(lng => lng.cluster_id == cl.id)
  }));
  const regions: List<LoadedRegion> = useAppSelector(
    state => state.regions
  ).mapToList(reg => ({
    ...reg,
    clusters: clusters.filter(cl => cl.region_id == reg.id),
    languages: languages.filter(lng => lng.region_id == reg.id)
  }));
  const userParticipants = useAppSelector(state => state.participants).filter(
    ptpt => ptpt.person_id == user.id
  );

  return {
    regions,
    userPrograms: {
      clusters: userParticipants
        .filter(ptpt => !!ptpt.cluster_id)
        .map(ptpt => clusters.get(ptpt.cluster_id!)),
      languages: userParticipants
        .filter(ptpt => !!ptpt.language_id)
        .map(ptpt => languages.get(ptpt.language_id!))
    }
  };
}
