import React from "react";

/*
    Required props:
        function handleInput
        int value
*/

function YearInput(props) {
  const name = props.name || "year";
  return (
    <input
      type="text"
      name={name}
      value={props.value}
      size="4"
      maxLength="4"
      placeholder={props.t("Year")}
      onChange={props.handleInput}
      className="form-control"
    />
  );
}

export default YearInput;
