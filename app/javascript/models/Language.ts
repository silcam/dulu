import baseCompare from "../util/baseCompare";
import { AppState } from "../reducers/appReducer";
import { IParticipant } from "./Participant";
import Activity, { IActivity, ActivityType } from "./Activity";
import { ById } from "./TypeBucket";

interface Progress {
  [stage: string]: number;
}

export interface ILanguage {
  id: number;
  name: string;
  cluster_id?: number;
  region_id?: number;
  progress: {
    Old_testament?: Progress;
    New_testament?: Progress;
  };
  can: { update_activites?: boolean; manage_participants?: boolean };
}

const emptyLanguage: ILanguage = {
  id: 0,
  name: "",
  progress: {},
  can: {}
};

function compare(a: ILanguage, b: ILanguage) {
  return baseCompare(a.name, b.name);
}

function activities(state: AppState, languageId: number, type?: ActivityType) {
  return (Object.values(state.activities) as IActivity[])
    .filter(
      a =>
        a.language_id == languageId &&
        (type ? Activity.matchesType(a, type) : true)
    )
    .sort(Activity.compare);
}

function participants(
  participants: ById<IParticipant>,
  languageId: number,
  clusterId?: number
) {
  return (Object.values(participants) as IParticipant[]).filter(
    ptpt =>
      ptpt.language_id == languageId ||
      (clusterId && ptpt.cluster_id == clusterId)
  );
}

export default {
  emptyLanguage,
  compare,
  activities,
  participants
};
