import React, { useEffect } from "react";
import NetworkErrorAlert from "./NetworkErrorAlert";
import { useLocation } from "react-router-dom";
import useTranslation from "../i18n/useTranslation";
import useAppSelector from "../reducers/useAppSelector";
import { useDispatch } from "react-redux";
import { setNetworkErrorStateAction } from "../reducers/networkReducer";

export default function NetworkErrorAlerts() {
  const t = useTranslation();
  const dispatch = useDispatch();

  const networkState = useAppSelector(state => state.network);
  const clearServerError = () =>
    dispatch(setNetworkErrorStateAction({ serverError: false }));

  // Clear Server errors on location change
  const location = useLocation();
  useEffect(() => {
    if (networkState.serverError) clearServerError();
  }, [location.pathname]);

  return (
    <div>
      {networkState.serverError && (
        <NetworkErrorAlert
          message={t("server_error_message")}
          close={clearServerError}
        />
      )}
      {networkState.connectionError && (
        <NetworkErrorAlert message={t("network_error_message")} />
      )}
    </div>
  );
}
