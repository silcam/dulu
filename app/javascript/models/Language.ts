import baseCompare from "../util/baseCompare";

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

export default {
  emptyLanguage,
  compare
};
