import { connect } from "react-redux";
import * as clusterActionCreators from "../../actions/clusterActions";
import ClustersBoard from "./ClustersBoard";
import { AppState } from "../../reducers/appReducer";
import { ICluster } from "../../models/Cluster";
import { setCan } from "../../actions/canActions";

const mapStateToProps = (state: AppState) => ({
  clusters: state.clusters.list.map(id => state.clusters.byId[id] as ICluster),
  can: state.can.clusters
});

const mapDispatchToProps = { ...clusterActionCreators, setCan };

const ClustersContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ClustersBoard);

export default ClustersContainer;
