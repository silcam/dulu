import React, { useContext } from "react";
import AlertBox from "./AlertBox";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  saving?: boolean;
  saved?: boolean;
}

export default function SaveIndicator(props: IProps) {
  const t = useContext(I18nContext);
  if (!props.saving && !props.saved) return null;

  return (
    <AlertBox text={props.saving ? t("Saving") : t("All_changes_saved")} />
  );
}
