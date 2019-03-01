import baseCompare from "../util/baseCompare";
import { IParticipant } from "./Participant";

export interface Person {
  id: number;
  first_name: string;
  last_name: string;
  can: { update?: boolean; destroy?: boolean };
  roles: string[];
  email: string;
  ui_language: string;
  email_pref: string;
  participants: IParticipant[]; // TODO - remove
}

export function personCompare(a: Person, b: Person): number {
  const lastNameComparison = baseCompare(a.last_name, b.last_name);
  if (lastNameComparison != 0) return lastNameComparison;
  const firstNameComparison = baseCompare(a.first_name, b.first_name);
  if (firstNameComparison != 0) return firstNameComparison;
  return b.id - a.id;
}

export function sameName(a: Person, b: Person): boolean {
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
