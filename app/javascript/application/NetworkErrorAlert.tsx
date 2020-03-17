import React from "react";
import AlertBox from "../components/shared/AlertBox";
import Spacer from "../components/shared/Spacer";
import useTranslation from "../i18n/useTranslation";

interface IProps {
  message: string;
  close?: () => void;
}

export default function NetworkErrorAlert(props: IProps) {
  const t = useTranslation();
  return (
    <AlertBox styleClass="alertBoxRed">
      <p style={{ textAlign: "center", margin: 0 }}>
        {props.message}
        <Spacer width="20px" />
        {props.close && (
          <button className="link" onClick={props.close}>
            {t("Close")}
          </button>
        )}
      </p>
    </AlertBox>
  );
}
