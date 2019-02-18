import { connect } from "react-redux";
import * as clusterActionCreators from "../../actions/clusterActions";
import ClustersBoard from "./ClustersBoard";
import { AppState } from "../../reducers/appReducer";
import { ICluster } from "../../models/Cluster";

const mapStateToProps = (state: AppState) => ({
  clusters: state.clusters.list.map(id => state.clusters.byId[id] as ICluster)
});

const mapDispatchToProps = clusterActionCreators;

const ClustersContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ClustersBoard);

export default ClustersContainer;
