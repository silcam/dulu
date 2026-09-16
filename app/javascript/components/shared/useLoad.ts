import DuluAxios, { IDuluAxios, MaybeAnyObj } from "../../util/DuluAxios";
import { useState, useEffect, DependencyList } from "react";
import { useDispatch } from "react-redux";
import { loadAction } from "../../reducers/LoadAction";

export type Load = (DuluAxios: IDuluAxios) => Promise<MaybeAnyObj>;

export default function useLoad(): [
  (load: Load) => Promise<MaybeAnyObj>,
  boolean
] {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const loader = async (load: Load) => {
    setLoading(true);
    const data = await load(DuluAxios);
    if (data) dispatch(loadAction(data));
    setLoading(false);
    return data;
  };
  return [loader, loading];
}

export function useLoadOnMount(
  path: string,
  deps: DependencyList = []
): boolean {
  const [loader, loading] = useLoad();

  // Uncheckable by construction, and that is the point of the hook: `deps` is a
  // parameter, so the list is whatever the caller passes and eslint has no literal to
  // read. `loader` and `path` go unlisted for the same reason -- loader is a new
  // closure on every render of the calling component, and callers that want a refetch
  // when the path changes pass that through `deps` themselves.
  /* eslint-disable react-hooks/exhaustive-deps -- see the note above */
  useEffect(() => {
    loader(axios => axios.get(path));
  }, deps);
  /* eslint-enable react-hooks/exhaustive-deps */

  return loading;
}
