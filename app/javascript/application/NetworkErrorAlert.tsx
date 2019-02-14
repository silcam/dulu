import React from "react";
import AlertBox from "../components/shared/AlertBox";
import { T } from "../i18n/i18n";
import Spacer from "../components/shared/Spacer";

interface IProps {
  message: string;
  close?: () => void;
  t: T;
}

export default function NetworkErrorAlert(props: IProps) {
  return (
    <AlertBox styleClass="alertBoxRed">
      <p style={{ textAlign: "center", margin: 0 }}>
        {props.message}
        <Spacer width="20px" />
        {props.close && (
          <button className="link" onClick={props.close}>
            {props.t("Close")}
          </button>
        )}
      </p>
    </AlertBox>
  );
}
