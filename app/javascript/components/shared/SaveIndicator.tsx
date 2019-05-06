import React, { useContext } from "react";
import AlertBox from "./AlertBox";
import I18nContext from "../../application/I18nContext";

interface IProps {
  saving?: boolean;
  saved?: boolean;
}

export default function SaveIndicator(props: IProps) {
  if (!props.saving && !props.saved) return null;

  const t = useContext(I18nContext);
  return (
    <AlertBox text={props.saving ? t("Saving") : t("All_changes_saved")} />
  );
}
