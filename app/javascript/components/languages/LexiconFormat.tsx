import React from "react";
import { IDomainStatusItem } from "../../models/DomainStatusItem";
import useTranslation from "../../i18n/useTranslation";

interface IProps {
  dsi: IDomainStatusItem;
}

export default function LexiconFormat(props: IProps) {
  const t = useTranslation();

  return (
    <div>
      <LexiconFormatLabel
        value={!!props.dsi.details.flexDatabase}
        text={t("Flex_database")}
      />
      <LexiconFormatLabel
        value={!!props.dsi.details.languageDepo}
        text={t("Language_depo")}
      />
    </div>
  );
}

function LexiconFormatLabel(props: { value: boolean; text: string }) {
  return (
    <label
      style={{ display: "block", fontWeight: "normal" }}
      className={props.value ? "" : "subdued"}
    >
      <input type="checkbox" checked={props.value} readOnly />
      {props.text}
    </label>
  );
}
