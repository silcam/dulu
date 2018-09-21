import baseCompare from "../util/baseCompare";

export function organizationCompare(a, b) {
  const nameComparison = baseCompare(a.short_name, b.short_name);
  if (nameComparison != 0) return nameComparison;
  return b.id - a.id;
}
