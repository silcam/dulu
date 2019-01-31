export default function baseCompare(strA, strB) {
  return strA.localeCompare(strB, undefined, { sensitivity: "base" });
}
