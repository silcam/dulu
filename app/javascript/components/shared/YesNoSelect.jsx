import React from "react";
import PropTypes from "prop-types";

export default function YesNoSelect(props) {
  return (
    <select
      value={props.value}
      onChange={e => props.updateValue(booleanize(e.target.value))}
    >
      <option value={true}>{props.t("Yes")}</option>

      <option value={false}>{props.t("No")}</option>
    </select>
  );
}

function booleanize(str) {
  return str === "true";
}

YesNoSelect.propTypes = {
  value: PropTypes.bool,
  updateValue: PropTypes.func.isRequired
};
