import { Selection } from "./Dashboard";
import { AppState } from "../../reducers/appReducer";
import Cluster from "../../models/Cluster";
import Region from "../../models/Region";
import { connect } from "react-redux";
import MainContent from "./MainContent";
import { flat } from "../../util/arrayUtils";

interface IProps {
  selection: Selection;
  userId: number;
}

const mapStateToProps = (state: AppState, ownProps: IProps) => {
  let languageIds;
  let selectedItem;
  switch (ownProps.selection.type) {
    case "language":
      languageIds = [ownProps.selection.id];
      selectedItem = state.languages.get(ownProps.selection.id);
      break;
    case "cluster":
      languageIds = clusterLanguages(state, ownProps.selection.id);
      selectedItem = state.clusters.get(ownProps.selection.id);
      break;
    case "region":
      languageIds = regionLanguages(state, ownProps.selection.id);
      selectedItem = state.regions.get(ownProps.selection.id);
      break;
    case "cameroon":
      languageIds = flat(
        state.regions.map(region => regionLanguages(state, region.id))
      );
      break;
    case "user":
      languageIds = userLanguages(state, ownProps.userId);
      break;
    default:
      languageIds = [] as number[];
  }

  return {
    languageIds: languageIds,
    selectedName: selectedItem ? selectedItem.name : undefined
  };
};

function clusterLanguages(state: AppState, clusterId: number) {
  return Cluster.languages(state, clusterId).map(lang => lang.id);
}

function regionLanguages(state: AppState, regionId: number) {
  return flat(
    Region.clusters(state, regionId).map(cluster =>
      clusterLanguages(state, cluster.id)
    )
  ).concat(Region.languages(state, regionId).map(lang => lang.id));
}

function userLanguages(state: AppState, userId: number) {
  return flat(
    state.participants
      .filter(ptpt => ptpt.person_id == userId)
      .map(ptpt =>
        ptpt.cluster_id
          ? clusterLanguages(state, ptpt.cluster_id)
          : [ptpt.language_id!]
      )
  );
}

const MainContentContainer = connect(mapStateToProps)(MainContent);

export default MainContentContainer;
