import DuluAxios, { IDuluAxios, MaybeAnyObj } from "../../util/DuluAxios";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadAction } from "../../reducers/LoadAction";

type Load = (DuluAxios: IDuluAxios) => Promise<MaybeAnyObj>;

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

export function useLoadOnMount(path: string, deps: any[] = []): boolean {
  const [loader, loading] = useLoad();

  useEffect(() => {
    loader(axios => axios.get(path));
  }, deps);

  return loading;
}
