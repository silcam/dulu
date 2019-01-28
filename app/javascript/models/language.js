import baseCompare from "../util/baseCompare";

export function languageCompare(a, b) {
  return baseCompare(a.name, b.name);
}
