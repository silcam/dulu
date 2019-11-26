import React, { useContext, useEffect } from "react";
import I18nContext from "../../contexts/I18nContext";
import { range } from "../../util/arrayUtils";

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
    if (parseInt(props.value) > props.maxValue)
      props.handleInput(`${props.maxValue}`);
  });

  return (
    <select
      className="form-control"
      name={name}
      value={String(parseInt(props.value))}
      onChange={e => props.handleInput(e.target.value)}
    >
      <option value="">{t("Day")}</option>
      {range(1, maxValue).map(day => (
        <option key={day} value={day}>
          {day}
        </option>
      ))}
    </select>
  );
}
