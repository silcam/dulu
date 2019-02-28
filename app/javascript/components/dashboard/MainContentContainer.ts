import { Selection } from "./Dashboard";
import { AppState } from "../../reducers/appReducer";
import Cluster from "../../models/Cluster";
import Region from "../../models/Region";
import { IParticipant } from "../../models/TypeBucket";
import { connect } from "react-redux";
import MainContent from "./MainContent";

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
      selectedItem = state.languages.byId[ownProps.selection.id];
      break;
    case "cluster":
      languageIds = clusterLanguages(state, ownProps.selection.id);
      selectedItem = state.clusters.byId[ownProps.selection.id];
      break;
    case "region":
      languageIds = regionLanguages(state, ownProps.selection.id);
      selectedItem = state.regions.byId[ownProps.selection.id];
      break;
    case "user":
      languageIds = userLanguages(state, ownProps.userId);
      break;
    case "cameroon":
    default:
      languageIds = state.regions.list
        .map(id => regionLanguages(state, id))
        .flat();
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
  return Region.clusters(state, regionId)
    .map(cluster => clusterLanguages(state, cluster.id))
    .flat()
    .concat(Region.languages(state, regionId).map(lang => lang.id));
}

function userLanguages(state: AppState, userId: number) {
  return (Object.values(state.participants) as IParticipant[])
    .filter(ptpt => ptpt.person_id == userId)
    .map(ptpt =>
      ptpt.cluster_id
        ? clusterLanguages(state, ptpt.cluster_id)
        : [ptpt.language_id!]
    )
    .flat();
}

const MainContentContainer = connect(mapStateToProps)(MainContent);

export default MainContentContainer;