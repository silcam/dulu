import React from "react";
import YesNoSelect from "./YesNoSelect";

export default function TextOrYesNo(props) {
  return props.editing ? (
    <YesNoSelect
      value={props.value}
      updateValue={props.updateValue}
      t={props.t}
    />
  ) : (
    <span>{props.value ? props.t("Yes") : props.t("No")}</span>
  );
}
