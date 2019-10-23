import React, { useContext, useEffect } from "react";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  handleInput: (day: string) => void;
  value: string;
  maxValue: number;
  name?: string;
}

export default function DaySelector(props: IProps) {
  const t = useContext(I18nContext);
  const name = props.name || "day";
  const maxValue = props.maxValue || 31;

  useEffect(() => {
    if (props.value > props.maxValue) props.handleInput(`${props.maxValue}`);
  });

  var optionsArray = [];
  for (var day = 1; day <= maxValue; ++day) {
    optionsArray.push(
      <option key={day} value={day}>
        {day}
      </option>
    );
  }
  return (
    <select
      className="form-control"
      name={name}
      value={String(parseInt(props.value))}
      onChange={e => props.handleInput(e.target.value)}
    >
      <option value="">{t("Day")}</option>
      {optionsArray}
    </select>
  );
}
