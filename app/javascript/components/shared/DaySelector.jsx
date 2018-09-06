import React from "react";

/*
    Required params:
        function handleInput
        int value
    Options params:
        int maxValue
        string name
*/

function DaySelector(props) {
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
      <option value="">{props.t("Day")}</option>
      {optionsArray}
    </select>
  );
}

export default DaySelector;
