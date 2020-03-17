import { Selection } from "../components/dashboard/Dashboard";
import { DRDataParams } from "../models/DomainReport";
import useAppSelector from "./useAppSelector";
import { useDispatch } from "react-redux";
import { setCurrentUserAction } from "./currentUserReducer";
import DuluAxios from "../util/DuluAxios";

export interface ViewPrefs {
  dashboardSelection?: Selection;
  dashboardTab?: string;
  notificationsTab?: number;
  domainReportParams?: DRDataParams;
}

export default function useViewPrefs() {
  const dispatch = useDispatch();

  const viewPrefs = useAppSelector(state => state.currentUser.view_prefs);
  const setViewPrefs = (mergeViewPrefs: ViewPrefs) => {
    const newViewPrefs = { ...viewPrefs, ...mergeViewPrefs };
    dispatch(setCurrentUserAction({ view_prefs: newViewPrefs }));
    DuluAxios.put("/api/people/update_view_prefs", {
      view_prefs: newViewPrefs
    });
  };
  return { viewPrefs, setViewPrefs };
}
