import React, { useContext } from "react";
import I18nContext from "../../contexts/I18nContext";

export interface IProps {
  value?: boolean;
  setValue: (value: boolean) => void;
}

export default function YesNoSelect(props: IProps) {
  const t = useContext(I18nContext);
  return (
    <select
      value={`${props.value}`}
      onChange={e => props.setValue(booleanize(e.target.value))}
    >
      <option value={"true"}>{t("Yes")}</option>

      <option value={"false"}>{t("No")}</option>
    </select>
  );
}

function booleanize(str: string) {
  return str === "true";
}
