import baseCompare from "../util/baseCompare";
import { Locale } from "../i18n/i18n";

export interface GrRole {
  value: string;
  display: string;
}
export type EmailPref = "immediate" | "daily" | "weekly";
export interface IPerson {
  id: number;
  first_name: string;
  last_name: string;
  can: { update?: boolean; destroy?: boolean; grant_login?: boolean };
  roles: string[];
  email: string;
  ui_language: Locale;
  email_pref: EmailPref;
  notification_channels: string;
  participants: Array<{
    id: number;
    language_id: number | null;
    cluster_id: number | null;
    name: string;
    roles: string[];
  }>; // TODO - remove
  grantable_roles: GrRole[];
  gender: "M" | "F";
  has_login?: boolean;
  not_a_duplicate?: boolean;
  country_id?: number | null;
  home_country?: { id: number | null; name: string };
  isUser?: boolean;
}

export type PartialPerson = Pick<IPerson, "id" | "first_name" | "last_name">;

export function personCompare(a: IPerson, b: IPerson): number {
  const lastNameComparison = baseCompare(a.last_name, b.last_name);
  if (lastNameComparison != 0) return lastNameComparison;
  const firstNameComparison = baseCompare(a.first_name, b.first_name);
  if (firstNameComparison != 0) return firstNameComparison;
  return b.id - a.id;
}

export function sameName(a: IPerson, b: IPerson): boolean {
  return (
    baseCompare(a.last_name, b.last_name) == 0 &&
    baseCompare(a.first_name, b.first_name) == 0
  );
}

export function fullName(person: {
  first_name: string;
  last_name: string;
}): string {
  return person.first_name + " " + person.last_name;
}
