import React, { useEffect } from "react";
import Loading from "../shared/Loading";
import { History } from "history";
import { IParticipant } from "../../models/Participant";
import { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";

interface IProps {
  history: History;
  id: number;
}

export default function ParticipantPage(props: IProps) {
  const loading = useLoadOnMount(`/api/participants/${props.id}`, [props.id]);

  const participant = useAppSelector(state => state.participants.get(props.id));

  useEffect(() => {
    if (participant.id > 0) {
      props.history.replace(routeTo(participant));
    }
  });

  return loading ? <Loading /> : null;
}

function routeTo(participant: IParticipant) {
  return participant.cluster_id
    ? `/clusters/${participant.cluster_id}/participants/${participant.id}`
    : `/languages/${participant.language_id}/participants/${participant.id}`;
}
