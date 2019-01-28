import baseCompare from "../util/baseCompare";

export function personCompare(a, b) {
  const lastNameComparison = baseCompare(a.last_name, b.last_name);
  if (lastNameComparison != 0) return lastNameComparison;
  const firstNameComparison = baseCompare(a.first_name, b.first_name);
  if (firstNameComparison != 0) return firstNameComparison;
  return b.id - a.id;
}

export function sameName(a, b) {
  return (
    baseCompare(a.last_name, b.last_name) == 0 &&
    baseCompare(a.first_name, b.first_name) == 0
  );
}

export function fullName(person) {
  return person.first_name + " " + person.last_name;
}
