import React, { useContext } from "react";
import AlertBox from "./AlertBox";
import I18nContext from "../../application/I18nContext";

export default function Loading() {
  const t = useContext(I18nContext);
  return <AlertBox text={t("Loading")} />;
}
