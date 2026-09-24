// `R` defaults to `T` so the common shape -- ifDef(x) with no callback -- keeps returning
// what it was given. Both application call sites pass only the first argument; `cb` and
// `ifNot` look dead from the app side but are covered by the unit tests, so they are typed
// rather than deleted.
export default function ifDef<T, R = T>(
  item: T | undefined | null,
  cb?: (item: T) => R,
  ifNot?: R
): T | R | "" {
  if (item !== undefined && item !== null) return cb ? cb(item) : item;
  return ifNot === undefined ? "" : ifNot;
}
