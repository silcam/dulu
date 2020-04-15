import baseCompare from "../util/baseCompare";
import { AppState } from "../reducers/appReducer";
import { IParticipant } from "./Participant";
import Activity, { ActivityType } from "./Activity";
import { IDomainStatusItem } from "./DomainStatusItem";
import List from "./List";
import { INote } from "./Note";
import { ClusterLanguage } from "../components/regions/ProgramList";

interface Progress {
  [stage: string]: number;
}

export interface ILanguage {
  id: number;
  name: string;
  code: string;
  cluster_id?: number;
  region_id?: number;
  progress: {
    Old_testament?: Progress;
    New_testament?: Progress;
  };
  domain_status_items: IDomainStatusItem[];
  notes: INote[];
  can: {
    update_activities?: boolean;
    manage_participants?: boolean;
    update?: boolean;
  };
}

const emptyLanguage: ILanguage = {
  id: 0,
  name: "",
  code: "",
  progress: {},
  domain_status_items: [],
  notes: [],
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

function emptyList() {
  return new List(emptyLanguage, [], compare);
}

function isLanguage(program: ClusterLanguage): program is ILanguage {
  return "code" in program;
}

export default {
  emptyLanguage,
  compare,
  activities,
  participants,
  emptyList,
  isLanguage
};
