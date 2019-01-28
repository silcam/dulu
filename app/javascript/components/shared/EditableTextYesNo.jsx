import React from "react";

import editableText from "./editableText";

/*
    Required props:
        text
        value
        field
        updateValue(field, value)
        editEnabled - boolean
        strings
*/

function YesNoSelect(props) {
  const handleChange = e => {
    const text = e.target.value ? props.t("Yes") : props.t("No");
    props.save(e.target.value, text);
  };

  const className = props.extraClasses
    ? `form-control ${props.extraClasses}`
    : "form-control";
  return (
    <select
      name={props.name}
      value={props.value}
      onChange={handleChange}
      className={className}
      autoFocus
      onBlur={props.cancel}
    >
      <option value={true}>{props.t("Yes")}</option>

      <option value={false}>{props.t("No")}</option>
    </select>
  );
}

const EditableTextYesNo = editableText(YesNoSelect);

export default EditableTextYesNo;
