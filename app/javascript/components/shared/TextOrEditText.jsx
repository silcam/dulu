import React from "react";

export default function TextOrEditText(props) {
  return props.editing ? (
    <input
      type="text"
      value={props.value}
      onChange={e => props.updateValue(e.target.value)}
    />
  ) : (
    <span>{props.value}</span>
  );
}
