import { connect } from "react-redux";
import * as participantActionCreators from "../../actions/participantActions";
import { setLanguage } from "../../actions/languageActions";
import ParticipantsTable from "./ParticipantsTable";
import { setCluster } from "../../actions/clusterActions";
import { addPeople } from "../../actions/peopleActions";
import update from "immutability-helper";
import { AppState } from "../../reducers/appReducer";
import { ICluster } from "../../models/Cluster";
import { IParticipant, IParticipantInflated } from "../../models/Participant";
import { ILanguage } from "../../models/Language";

interface IProps {
  language?: ILanguage;
  cluster?: ICluster;
}

const mapStateToProps = (state: AppState, ownProps: IProps) => {
  const participants = (Object.values(state.participants) as IParticipant[])
    .filter(
      ownProps.language
        ? languageFilter(ownProps.language)
        : clusterFilter(ownProps.cluster!)
    )
    .map(p =>
      // TODO - Write a participant inflater
      update(p, {
        $merge: {
          person: state.people.byId[p.person_id],
          language: p.language_id
            ? state.languages.byId[p.language_id]
            : undefined,
          cluster: p.cluster_id ? state.clusters.byId[p.cluster_id] : undefined
        }
      })
    ) as IParticipantInflated[];

  return {
    participants: participants
  };
};

function languageFilter(language: ILanguage) {
  return (p: IParticipant) =>
    p.language_id == language.id || p.cluster_id == language.cluster_id;
}

function clusterFilter(cluster: ICluster) {
  return (p: IParticipant) => p.cluster_id == cluster.id;
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
