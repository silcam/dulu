import { connect } from "react-redux";
import * as participantActionCreators from "../../actions/participantActions";
import { setLanguage } from "../../actions/languageActions";
import ParticipantsTable from "./ParticipantsTable";
import { setCluster } from "../../actions/clusterActions";
import { addPeople } from "../../actions/peopleActions";

const mapStateToProps = (state, ownProps) => {
  const participants = Object.values(state.participants).filter(
    ownProps.language
      ? languageFilter(ownProps.language)
      : clusterFilter(ownProps.cluster)
  );

  return {
    participants: participants,
    people: participants.reduce((people, participant) => {
      people[participant.person_id] = state.people.byId[participant.person_id];
      return people;
    }, {})
  };
};

function languageFilter(language) {
  return p =>
    p.language_id == language.id || p.cluster_id == language.cluster_id;
}

function clusterFilter(cluster) {
  return p => p.cluster_id == cluster.id;
}

const mapDispatchToProps = {
  ...participantActionCreators,
  addPeople,
  setLanguage,
  setCluster
};

const ParticipantsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipantsTable);

export default ParticipantsContainer;
