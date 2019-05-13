import baseCompare from "../util/baseCompare";
import { AppState } from "../reducers/appReducer";
import { IParticipant } from "./Participant";
import Activity, { ActivityType } from "./Activity";
import { IDomainStatusItem } from "./DomainStatusItem";
import List from "./List";

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
  domain_status_items: IDomainStatusItem[];
  can: {
    update_activities?: boolean;
    manage_participants?: boolean;
    update?: boolean;
  };
}

const emptyLanguage: ILanguage = {
  id: 0,
  name: "",
  progress: {},
  domain_status_items: [],
  can: {}
};

function compare(a: ILanguage, b: ILanguage) {
  return baseCompare(a.name, b.name);
}

function activities(state: AppState, languageId: number, type?: ActivityType) {
  return state.activities.filter(
    a =>
      a.language_id == languageId &&
      (type ? Activity.matchesType(a, type) : true)
  );
}

function participants(
  participants: List<IParticipant>,
  languageId: number,
  clusterId?: number
) {
  return participants.filter(
    ptpt =>
      ptpt.language_id == languageId ||
      !!(clusterId && ptpt.cluster_id == clusterId)
  );
}

export default {
  emptyLanguage,
  compare,
  activities,
  participants
};
