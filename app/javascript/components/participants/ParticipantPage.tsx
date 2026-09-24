import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import Loading from "../shared/Loading";
import { IParticipant } from "../../models/Participant";
import { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";

export default function ParticipantPage() {
  const id = parseInt(useParams().id!);
  const navigate = useNavigate();
  const loading = useLoadOnMount(`/api/participants/${id}`, [id]);

  const participant = useAppSelector(state => state.participants.get(id));

  useEffect(() => {
    if (participant.id > 0) {
      navigate(routeTo(participant), { replace: true });
    }
  });

  return loading ? <Loading /> : null;
}

function routeTo(participant: IParticipant) {
  return participant.cluster_id
    ? `/clusters/${participant.cluster_id}/participants/${participant.id}`
    : `/languages/${participant.language_id}/participants/${participant.id}`;
}
