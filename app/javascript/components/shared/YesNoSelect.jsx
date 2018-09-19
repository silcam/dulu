import React from "react";

export default function YesNoSelect(props) {
  // const handleChange = e => {
  //   const text = e.target.value ? props.t("Yes") : props.t("No");
  //   props.save(e.target.value, text);
  // };

  // const className = props.extraClasses
  //   ? `form-control ${props.extraClasses}`
  //   : "form-control";
  return (
    <select
      value={props.value}
      onChange={e => props.updateValue(e.target.value)}
    >
      <option value={true}>{props.t("Yes")}</option>

      <option value={false}>{props.t("No")}</option>
    </select>
  );
}
