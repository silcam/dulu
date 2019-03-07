import { useEffect } from "react";

/*
  Useful when a piece of state needs to be on a certain list, but the list can change
  and we need to reset the state when that happens.
*/

export default function useKeepStateOnList<T>(
  item: T,
  setItem: (t: T) => void,
  list: T[]
) {
  useEffect(() => {
    if (!list.includes(item)) setItem(list[0]);
  });
}
