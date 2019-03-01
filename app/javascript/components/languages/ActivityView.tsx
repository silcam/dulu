import React, { useContext } from "react";
import ProgressBar from "../shared/ProgressBar";
import Activity, { IActivity } from "../../models/Activity";
import Loading from "../shared/Loading";
import { Person } from "../../models/Person";
import WorkshopActivity from "../workshops/WorkshopActivity";
import { Setter, Adder, ById } from "../../models/TypeBucket";
import { ILanguage } from "../../models/Language";
import I18nContext from "../../application/I18nContext";
import VSpacer from "../shared/VSpacer";
import ActivityViewPeople from "./ActivityViewPeople";
import { IParticipant } from "../../models/Participant";
import { useAPIGet } from "../../util/useAPI";
import { ICluster } from "../../models/Cluster";

interface IProps {
  activityId: number;
  activity: IActivity | undefined;
  participants: ById<IParticipant>;
  people: ById<Person>;
  basePath: string;
  language: ILanguage;

  setActivity: Setter<IActivity>;
  setLanguage: Setter<ILanguage>;
  addParticipants: Adder<IParticipant>;
  addPeople: Adder<Person>;
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

  useAPIGet(`/api/activities/${props.activityId}`, {}, actions, [
    props.activityId
  ]);

  if (!props.activity) return <Loading />;

  if (Activity.isWorkshops(props.activity))
    return <WorkshopActivity {...props} actions={actions} />;

  return (
    <div>
      <h2>{Activity.name(props.activity, t)}</h2>
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
    </div>
  );
}
