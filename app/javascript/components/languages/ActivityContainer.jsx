import { connect } from "react-redux";
import * as activityActionCreators from "../../actions/activityActions";
import { setLanguage } from "../../actions/languageActions";
import ActivityView from "./ActivityView";
import { addParticipants } from "../../actions/participantActions";
import { addPeople } from "../../actions/peopleActions";

const mapStateToProps = (state, ownProps) => {
  const activity = state.activities[ownProps.activityId];
  if (!activity || !activity.participant_ids)
    return { activity: activity, participants: [], people: [] };
  const participants = activity.participant_ids.map(
    id => state.participants[id]
  );
  return {
    activity: activity,
    participants: participants,
    people: participants.map(
      participant => state.people.byId[participant.person_id]
    )
  };
};

const mapDispatchToProps = {
  ...activityActionCreators,
  setLanguage,
  addParticipants,
  addPeople
};

const ActivityContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityView);

export default ActivityContainer;
