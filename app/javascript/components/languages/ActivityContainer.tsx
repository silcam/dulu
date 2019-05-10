import { connect } from "react-redux";
import * as activityActionCreators from "../../actions/activityActions";
import { setLanguage } from "../../actions/languageActions";
import ActivityView from "./ActivityView";
import { addParticipants } from "../../actions/participantActions";
import { addPeople } from "../../actions/peopleActions";
import { AppState } from "../../reducers/appReducer";
import { setCluster } from "../../actions/clusterActions";

interface IProps {
  activityId: number;
}

const mapStateToProps = (state: AppState, ownProps: IProps) => ({
  activity: state.activities[ownProps.activityId],
  participants: state.participants,
  people: state.people
});

const mapDispatchToProps = {
  setActivity: activityActionCreators.setActivity,
  setLanguage,
  addParticipants,
  addPeople,
  setCluster
};

const ActivityContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityView);

export default ActivityContainer;
