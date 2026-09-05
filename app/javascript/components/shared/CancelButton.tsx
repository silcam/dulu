import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import I18nContext from "../../contexts/I18nContext";

function CancelButton() {
  const t = useContext(I18nContext);
  const history = useHistory();
  return (
    <button className="btnRed" onClick={history.goBack}>
      {t("Cancel")}
    </button>
  );
}

export default CancelButton;
