import { useState } from "react";
import { AnyObj } from "../models/TypeBucket";
import update from "immutability-helper";

export default function useMergeState<T extends {}>(defaultValue: T) {
  const [state, setState] = useState<T>(defaultValue);
  const mergeState = (mergeState: AnyObj) =>
    setState(update(state, { $merge: mergeState }));
  return [state, mergeState];
}
