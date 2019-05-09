import { connect } from "react-redux";
import * as clusterActionCreators from "../../actions/clusterActions";
import ClusterPage from "./ClusterPage";
import { AppState } from "../../reducers/appReducer";
import Cluster from "../../models/Cluster";
import { addPeople } from "../../actions/peopleActions";
import { addParticipants } from "../../actions/participantActions";
import { addLanguages } from "../../actions/languageActions";

interface IProps {
  id: number;
}

const mapStateToProps = (state: AppState, ownProps: IProps) => {
  const cluster = state.clusters.get(ownProps.id);
  return {
    cluster: Cluster.inflate(state, cluster),
    languages: state.languages
  };
};

const mapDispatchToProps = {
  ...clusterActionCreators,
  addPeople,
  addParticipants,
  addLanguages
};

const ClusterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ClusterPage);

export default ClusterContainer;
