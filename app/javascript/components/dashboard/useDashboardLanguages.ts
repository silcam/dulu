import { Selection } from "./Dashboard";
import { ICluster } from "../../models/Cluster";
import { flat } from "../../util/arrayUtils";
import useAppSelector from "../../reducers/useAppSelector";
import List from "../../models/List";
import { ILanguage } from "../../models/Language";
import { IParticipant } from "../../models/Participant";

export default function useDashboardLanguages(selection: Selection) {
  const user = useAppSelector(state => state.currentUser);
  const languages = useAppSelector(state => state.languages);
  const clusters = useAppSelector(state => state.clusters);
  const regions = useAppSelector(state => state.regions);
  const participants = useAppSelector(state => state.participants);

  let languageIds;
  let selectedItem;
  switch (selection.type) {
    case "language":
      languageIds = [selection.id];
      selectedItem = languages.get(selection.id);
      break;
    case "cluster":
      languageIds = clusterLanguages(languages, selection.id);
      selectedItem = clusters.get(selection.id);
      break;
    case "region":
      languageIds = regionLanguages(clusters, languages, selection.id);
      selectedItem = regions.get(selection.id);
      break;
    case "cameroon":
      languageIds = flat(
        regions.map(region => regionLanguages(clusters, languages, region.id))
      );
      break;
    case "user":
      languageIds = userLanguages(participants, languages, user.id);
      break;
    default:
      languageIds = [] as number[];
  }

  return {
    languageIds: languageIds,
    selectedName: selectedItem ? selectedItem.name : undefined
  };
}

function clusterLanguages(languages: List<ILanguage>, clusterId: number) {
  return languages
    .filter(lang => lang.cluster_id == clusterId)
    .map(lang => lang.id);
}

function regionLanguages(
  clusters: List<ICluster>,
  languages: List<ILanguage>,
  regionId: number
) {
  return flat(
    clusters
      .filter(cl => cl.region_id == regionId)
      .map(cl => clusterLanguages(languages, cl.id))
  ).concat(
    languages.filter(lang => lang.region_id == regionId).map(lang => lang.id)
  );
}

function userLanguages(
  participants: List<IParticipant>,
  languages: List<ILanguage>,
  userId: number
) {
  return flat(
    participants
      .filter(ptpt => ptpt.person_id == userId)
      .map(ptpt =>
        ptpt.cluster_id
          ? clusterLanguages(languages, ptpt.cluster_id)
          : [ptpt.language_id!]
      )
  );
}
