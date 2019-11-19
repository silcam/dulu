import React, { useContext } from "react";
import I18nContext from "../../contexts/I18nContext";
import { ILanguage } from "../../models/Language";
import ProgressBarTranslation from "../shared/ProgressBarTranslation";

interface IProps {
  language: ILanguage;
}

export default function TranslationProgress(props: IProps) {
  const t = useContext(I18nContext);

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {([
        "Old_testament",
        "New_testament"
      ] as (keyof ILanguage["progress"])[]).map(testament =>
        props.language.progress[testament] ? (
          <div style={{ paddingRight: "24px", verticalAlign: "top" }}>
            <label style={{ paddingRight: "8px" }}>{t(testament)}</label>
            <ProgressBarTranslation
              progress={props.language.progress[testament]!}
            />
          </div>
        ) : null
      )}
    </div>
  );
}
