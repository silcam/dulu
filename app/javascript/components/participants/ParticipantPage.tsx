import React from "react";
import Loading from "../shared/Loading";
import { History } from "history";
import { IParticipant } from "../../models/Participant";
import { Setter } from "../../models/TypeBucket";
import { useAPIGet } from "../../util/useAPI";
import { connect } from "react-redux";
import { AppState } from "../../reducers/appReducer";
import { addParticipant } from "../../actions/participantActions";

interface IProps {
  history: History;
  id: number;
  participant?: IParticipant;
  addParticipant: Setter<IParticipant>;
}

function BaseParticipantPage(props: IProps) {
  const loading = useAPIGet(`/api/participants/${props.id}`, undefined, {
    addParticipant: props.addParticipant
  });

  if (props.participant) {
    props.history.replace(routeTo(props.participant));
  }

  return loading ? <Loading /> : null;
}

function routeTo(participant: IParticipant) {
  return participant.cluster_id
    ? `/clusters/${participant.cluster_id}/participants/${participant.id}`
    : `/languages/${participant.language_id}/participants/${participant.id}`;
}

const ParticipantPage = connect(
  (state: AppState, ownProps: { id: number }) => ({
    participant: state.participants[ownProps.id]
  }),
  {
    addParticipant
  }
)(BaseParticipantPage);

export default ParticipantPage;
