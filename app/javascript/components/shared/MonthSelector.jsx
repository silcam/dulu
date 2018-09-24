import React from "react";
import PropTypes from "prop-types";

export default function MonthSelector(props) {
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

MonthSelector.propTypes = {
  handleInput: PropTypes.func.isRequired,
  value: PropTypes.number,
  t: PropTypes.func.isRequired,
  name: PropTypes.string
};
