import { connect } from "react-redux";
import Activity from "../../models/Activity";
import * as participantActionCreators from "../../actions/participantActions";
import { setPerson } from "../../actions/peopleActions";
import { addActivities } from "../../actions/activityActions";
import { setLanguage } from "../../actions/languageActions";
import { setCluster } from "../../actions/clusterActions";
import ParticipantView from "./ParticipantView";
import { AppState } from "../../reducers/clustersReducer";

interface IProps {
  id: number;
}

const mapStateToProps = (state: AppState, ownProps: IProps) => {
  const participant = state.participants[ownProps.id];
  if (!participant) return { participant: participant };
  return {
    participant: participant,
    person: state.people.byId[participant.person_id],
    clusterLanguage: participant.cluster_id
      ? state.clusters.byId[participant.cluster_id]
      : state.languages.byId[participant.language_id!],
    activities: (Object.values(state.activities) as {
      participant_ids?: number[];
    }[])
      .filter(
        activity =>
          activity.participant_ids &&
          activity.participant_ids.includes(ownProps.id)
      )
      .sort(Activity.compare)
  };
};

const mapDispatchToProps = {
  ...participantActionCreators,
  addActivities,
  setPerson,
  setLanguage,
  setCluster
};

const ParticipantContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipantView);

export default ParticipantContainer;
