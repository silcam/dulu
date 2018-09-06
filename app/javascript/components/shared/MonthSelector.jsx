import React from "react";

/*
    Required props:
        function handleInput
        int value
        strings (date_strings)
    Optional props:
        string name
*/

// const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function MonthSelector(props) {
  const name = props.name || "month";
  return (
    <select
      className="form-control"
      name={name}
      value={String(props.value)}
      onChange={props.handleInput}
    >
      <option value="">{props.t("Month")}</option>
      {props.t("month_names_short").map((month, index) => {
        return (
          <option key={index + 1} value={index + 1}>
            {month}
          </option>
        );
      })}
    </select>
  );
}

export default MonthSelector;
