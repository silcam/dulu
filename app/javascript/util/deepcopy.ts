import merge from "deepmerge";
// import { AnyObj } from "../models/TypeBucket";

/**
 * Actually, I'm not convinced this does what I think it does...
 */

export default function deepcopy(obj: any) {
  return merge(obj, {});
}
