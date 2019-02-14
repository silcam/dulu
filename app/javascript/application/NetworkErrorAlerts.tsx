import React from "react";
import { T } from "../i18n/i18n";
import NetworkErrorAlert from "./NetworkErrorAlert";

interface IProps {
  t: T;
  connectionError?: boolean;
  serverError?: boolean;
  clearServerError: () => void;
}

export default function NetworkErrorAlerts(props: IProps) {
  return (
    <div>
      {props.serverError && (
        <NetworkErrorAlert
          message={props.t("server_error_message")}
          close={props.clearServerError}
          t={props.t}
        />
      )}
      {props.connectionError && (
        <NetworkErrorAlert
          message={props.t("network_error_message")}
          t={props.t}
        />
      )}
    </div>
  );
}
