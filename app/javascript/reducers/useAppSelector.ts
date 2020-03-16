import { AppState } from "./appReducer";
import { useSelector, TypedUseSelectorHook, shallowEqual } from "react-redux";
import { IEventParticipant, IEventParticipantExtended } from "../models/Event";
import { fullName } from "../models/Person";

type AppUseSelector = TypedUseSelectorHook<AppState>;

const useAppSelector: AppUseSelector = useSelector;

export default useAppSelector;

export function useLanguages(ids: number[]) {
  return useAppSelector(
    state => state.languages.filter(lang => ids.includes(lang.id)).toArray(),
    shallowEqual
  );
}

export function useClusters(ids: number[]) {
  return useAppSelector(
    state => state.clusters.filter(cl => ids.includes(cl.id)).toArray(),
    shallowEqual
  );
}

export function usePeople(ids: number[]) {
  return useAppSelector(
    state => state.people.filter(p => ids.includes(p.id)).toArray(),
    shallowEqual
  );
}

export function useEventParticipants(
  eps: IEventParticipant[]
): IEventParticipantExtended[] {
  return useAppSelector(state =>
    eps.map(ep => ({
      ...ep,
      full_name: fullName(state.people.get(ep.person_id))
    }))
  );
}
