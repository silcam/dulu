export default function baseCompare(strA, strB) {
  return strB.localeCompare(strA, undefined, { sensitivity: "base" });
}
