import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import I18nContext from "../../contexts/I18nContext";

function CancelButton() {
  const t = useContext(I18nContext);
  const navigate = useNavigate();
  return (
    <button className="btnRed" onClick={() => navigate(-1)}>
      {t("Cancel")}
    </button>
  );
}

export default CancelButton;
