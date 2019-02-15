import { connect } from "react-redux";
import ClusterParticipantPage from "./ClusterParticipantPage";
import { AppState } from "../../reducers/clustersReducer";

interface IProps {
  id: number;
}

const mapStateToProps = (state: AppState, ownProps: IProps) => ({
  cluster: state.clusters.byId[ownProps.id]
});

const ClusterParticipantPageContainer = connect(mapStateToProps)(
  ClusterParticipantPage
);

export default ClusterParticipantPageContainer;
