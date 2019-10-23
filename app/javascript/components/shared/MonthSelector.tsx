import React, { useContext } from "react";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  value: string;
  handleInput: (month: string) => void;
  name?: string;
}

export default function MonthSelector(props: IProps) {
  const name = props.name || "month";
  const t = useContext(I18nContext);
  return (
    <select
      className="form-control"
      name={name}
      value={String(parseInt(props.value))}
      onChange={e => props.handleInput(e.target.value)}
    >
      <option value="">{t("Month")}</option>
      {t("month_names_short").map((month: string, index: number) => {
        return (
          <option key={index + 1} value={index + 1}>
            {month}
          </option>
        );
      })}
    </select>
  );
}
