import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import Loading from "../shared/Loading";
import { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";

export default function ActivityPage() {
  const id = useParams().id!;
  const navigate = useNavigate();
  const loading = useLoadOnMount(`/api/activities/${id}`);
  const activity = useAppSelector(state =>
    state.activities.get(parseInt(id))
  );

  useEffect(() => {
    if (activity.id > 0)
      navigate(`/languages/${activity.language_id}/activities/${activity.id}`, {
        replace: true
      });
  });

  return loading ? <Loading /> : null;
}
