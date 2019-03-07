import { AnyObj } from "../models/TypeBucket";

export default function filterObject(obj: AnyObj, ...keys: string[]) {
  return keys.reduce(
    (accum, key) => {
      accum[key] = obj[key];
      return accum;
    },
    {} as AnyObj
  );
}
