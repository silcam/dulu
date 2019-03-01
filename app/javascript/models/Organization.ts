import baseCompare from "../util/baseCompare";

export interface IOrganization {
  id: number;
  short_name: string;
}

export interface IOrganizationPerson {
  id: number;
  person_id: number;
  organization_id: number;
}

function compare(a: IOrganization, b: IOrganization) {
  const nameComparison = baseCompare(a.short_name, b.short_name);
  if (nameComparison != 0) return nameComparison;
  return b.id - a.id;
}

export default {
  compare
};
