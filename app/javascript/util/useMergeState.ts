import { useState } from "react";
import { Partial } from "../models/TypeBucket";
import update from "immutability-helper";
import { Spec } from "immutability-helper";

// `object`, not `{}`: the two differ in that `{}` admits any non-nullish value, so
// `useMergeState(42)` type-checked before today. Nothing merges into a number.
export default function useMergeState<T extends object>(
  defaultValue: T
): [T, (mergeState: Partial<T>) => void] {
  const [state, setState] = useState<T>(defaultValue);
  const mergeState = (mergeState: Partial<T>) =>
    // `Spec<T>` is a conditional type: on an unresolved type parameter every branch
    // stays deferred, so it collapses to `$set`/`$apply` and the object commands
    // disappear. immutability-helper 2's types were `any`, which is why this compiled
    // before. The cast is the workaround the library's own issue tracker documents.
    setState(update(state, { $merge: mergeState } as Spec<T>));
  return [state, mergeState];
}
