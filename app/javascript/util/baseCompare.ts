export default function baseCompare(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}
