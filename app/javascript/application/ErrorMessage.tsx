import React, { useContext } from "react";
import I18nContext from "../contexts/I18nContext";

export default function ErrorMessage() {
  const t = useContext(I18nContext);

  return (
    <div style={{ paddingLeft: "40px" }}>
      <h2>{t("ErrorHeader")}</h2>
      <p>{t("ErrorMessage")}</p>
      <button
        onClick={() => {
          location.reload();
        }}
      >
        {t("Reload")}
      </button>
    </div>
  );
}
