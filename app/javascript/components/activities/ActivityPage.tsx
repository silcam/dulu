import { useHistory } from "react-router-dom";
import React, { useEffect } from "react";
import Loading from "../shared/Loading";
import { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";

interface IProps {
  id: string;
}

export default function ActivityPage(props: IProps) {
  const history = useHistory();
  const loading = useLoadOnMount(`/api/activities/${props.id}`);
  const activity = useAppSelector(state =>
    state.activities.get(parseInt(props.id))
  );

  useEffect(() => {
    if (activity.id > 0)
      history.replace(
        `/languages/${activity.language_id}/activities/${activity.id}`
      );
  });

  return loading ? <Loading /> : null;
}
