import React, { useEffect } from "react";
import NavBar from "../components/layout/NavBar";
import styles from "./DuluApp.css";
import NetworkErrorAlerts from "./NetworkErrorAlerts";
import DuluAxios, { DuluAxiosError } from "../util/DuluAxios";
import MainRouter from "./MainRouter";
import I18nContext from "../contexts/I18nContext";
import { useDispatch } from "react-redux";
import {
  setNetworkErrorStateAction,
  networkAddLoadingAction,
  networkSubtractLoadingAction
} from "../reducers/networkReducer";
import { User, setCurrentUserAction } from "../reducers/currentUserReducer";
import useTranslation from "../i18n/useTranslation";

export default function DuluApp() {
  const dispatch = useDispatch();

  const t = useTranslation();

  useEffect(() => {
    DuluAxios.setNetworkError = (error: DuluAxiosError) =>
      dispatch(
        setNetworkErrorStateAction(
          error.type == "connection"
            ? { connectionError: true }
            : { serverError: true }
        )
      );
    DuluAxios.clearNetworkError = () =>
      dispatch(setNetworkErrorStateAction({ connectionError: false }));
    DuluAxios.addLoading = () => dispatch(networkAddLoadingAction());
    DuluAxios.subtractLoading = () => dispatch(networkSubtractLoadingAction());

    const user = getUser();
    if (user) dispatch(setCurrentUserAction(user));
    // `dispatch` belongs in the list and costs nothing: react-redux returns the
    // store's own dispatch, which is created once and never replaced, so naming it
    // leaves this a once-on-mount effect while making that a fact the linter can
    // check rather than one a reader has to take on trust.
  }, [dispatch]);

  return (
    <I18nContext.Provider value={t}>
      <div className={styles.container}>
        <NavBar />
        <NetworkErrorAlerts />
        <MainRouter />
      </div>
    </I18nContext.Provider>
  );
}

function getUser(): User | undefined {
  const userJson = document?.getElementById("userData")?.innerHTML;
  return userJson && JSON.parse(userJson);
}
