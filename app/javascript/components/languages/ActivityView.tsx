import React, { useContext } from "react";
import ProgressBar from "../shared/ProgressBar";
import Activity from "../../models/Activity";
import Loading from "../shared/Loading";
import WorkshopActivity from "../workshops/WorkshopActivity";
import { ILanguage } from "../../models/Language";
import I18nContext from "../../contexts/I18nContext";
import VSpacer from "../shared/VSpacer";
import ActivityViewPeople from "./ActivityViewPeople";
import ActivityViewStages from "./ActivityViewStages";
import AudioBookList from "./AudioBookList";
import { useLoadOnMount } from "../shared/useLoad";
import useAppSelector from "../../reducers/useAppSelector";

interface IProps {
  activityId: number;
  basePath: string;
  language: ILanguage;
}

export default function ActivityView(props: IProps) {
  const t = useContext(I18nContext);

  const activity = useAppSelector(state =>
    state.activities.get(props.activityId)
  );

  useLoadOnMount(`/api/activities/${props.activityId}`, [props.activityId]);

  if (activity.id == 0) return <Loading />;

  if (Activity.isWorkshops(activity))
    return <WorkshopActivity {...props} activity={activity} />;

  return (
    <div>
      <h2>
        {Activity.name(activity, t)}
        <AudioBookList activity={activity} />
      </h2>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <ProgressBar {...Activity.progress(activity)} />
        <span style={{ marginLeft: "8px" }}>
          {Activity.currentStageName(activity, t)}
        </span>
      </div>
      <VSpacer height={40} />
      <ActivityViewPeople {...props} activity={activity!} />
      <VSpacer height={40} />
      <ActivityViewStages activity={activity} />
    </div>
  );
}
