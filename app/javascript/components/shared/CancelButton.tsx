import React, { useContext } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import I18nContext from "../../application/I18nContext";

function CancelButtonInner(props: RouteComponentProps) {
  const t = useContext(I18nContext);
  return (
    <button className="btnRed" onClick={props.history.goBack}>
      {t("Cancel")}
    </button>
  );
}

const CancelButton = withRouter(CancelButtonInner);

export default CancelButton;
