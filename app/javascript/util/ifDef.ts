export default function ifDef<T>(
  item: T | undefined | null,
  cb?: (item: T) => any,
  ifNot?: any
) {
  if (item !== undefined && item !== null) return cb ? cb(item) : item;
  return ifNot === undefined ? "" : ifNot;
}
