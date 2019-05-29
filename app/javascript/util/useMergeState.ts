import { useState } from "react";
import { Partial } from "../models/TypeBucket";
import update from "immutability-helper";

export default function useMergeState<T extends {}>(
  defaultValue: T
): [T, (mergeState: Partial<T>) => void] {
  const [state, setState] = useState<T>(defaultValue);
  const mergeState = (mergeState: Partial<T>) =>
    setState(update(state, { $merge: mergeState }));
  return [state, mergeState];
}
