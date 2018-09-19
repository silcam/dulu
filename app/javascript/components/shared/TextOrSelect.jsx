import React from "react";

export default function TextOrSelect(props) {
  return props.editing ? (
    <select
      value={props.value}
      onChange={e => {
        props.updateValue(e.target.value);
      }}
    >
      {Object.keys(props.options).map(key => (
        <option key={key} value={key}>
          {props.options[key]}
        </option>
      ))}
    </select>
  ) : (
    <span>{props.options[props.value]}</span>
  );
}
