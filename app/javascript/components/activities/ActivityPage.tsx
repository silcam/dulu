import React, { useEffect } from "react";
import Loading from "../shared/Loading";
import { History } from "history";
import { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";

interface IProps {
  history: History<any>;
  id: string;
}

export default function ActivityPage(props: IProps) {
  const loading = useLoadOnMount(`/api/activities/${props.id}`);
  const activity = useAppSelector(state =>
    state.activities.get(parseInt(props.id))
  );

  useEffect(() => {
    if (activity.id > 0)
      props.history.replace(
        `/languages/${activity.language_id}/activities/${activity.id}`
      );
  });

  return loading ? <Loading /> : null;
}
