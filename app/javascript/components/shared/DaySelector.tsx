import React, { useContext } from "react";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  handleInput: (e: { target: { name: any; value: any } }) => void;
  value: number | string;
  maxValue: number;
  name: string;
}

export default function DaySelector(props: IProps) {
  const t = useContext(I18nContext);
  const name = props.name || "day";
  const maxValue = props.maxValue || 31;

  if (props.value > props.maxValue)
    props.handleInput({ target: { name: name, value: props.maxValue } });

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
      value={String(props.value)}
      onChange={props.handleInput}
    >
      <option value="">{t("Day")}</option>
      {optionsArray}
    </select>
  );
}
