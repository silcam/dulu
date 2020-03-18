import React, { useContext } from "react";
import ProgressBar from "../shared/ProgressBar";
import Activity, { IActivity } from "../../models/Activity";
import Loading from "../shared/Loading";
import { IPerson } from "../../models/Person";
import WorkshopActivity from "../workshops/WorkshopActivity";
import { Setter, Adder } from "../../models/TypeBucket";
import { ILanguage } from "../../models/Language";
import I18nContext from "../../contexts/I18nContext";
import VSpacer from "../shared/VSpacer";
import ActivityViewPeople from "./ActivityViewPeople";
import { IParticipant } from "../../models/Participant";
import { ICluster } from "../../models/Cluster";
import List from "../../models/List";
import ActivityViewStages from "./ActivityViewStages";
import AudioBookList from "./AudioBookList";
import { useLoadOnMount } from "../shared/useLoad";

interface IProps {
  activityId: number;
  activity: IActivity;
  participants: List<IParticipant>;
  people: List<IPerson>;
  basePath: string;
  language: ILanguage;

  setActivity: Setter<IActivity>;
  setLanguage: Setter<ILanguage>;
  addParticipants: Adder<IParticipant>;
  addPeople: Adder<IPerson>;
  setCluster: Setter<ICluster>;
}

export default function ActivityView(props: IProps) {
  const t = useContext(I18nContext);
  const actions = {
    setActivity: props.setActivity,
    setLanguage: props.setLanguage,
    addParticipants: props.addParticipants,
    addPeople: props.addPeople,
    setCluster: props.setCluster
  };

  useLoadOnMount(`/api/activities/${props.activityId}`, [props.activityId]);

  if (props.activity.id == 0) return <Loading />;

  if (Activity.isWorkshops(props.activity))
    return (
      <WorkshopActivity
        {...props}
        actions={actions}
        activity={props.activity}
      />
    );

  return (
    <div>
      <h2>
        {Activity.name(props.activity, t)}
        <AudioBookList activity={props.activity} />
      </h2>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <ProgressBar {...Activity.progress(props.activity)} />
        <span style={{ marginLeft: "8px" }}>
          {Activity.currentStageName(props.activity, t)}
        </span>
      </div>
      <VSpacer height={40} />
      <ActivityViewPeople
        {...props}
        activity={props.activity!}
        actions={actions}
      />
      <VSpacer height={40} />
      <ActivityViewStages
        activity={props.activity}
        setActivity={props.setActivity}
      />
    </div>
  );
}
