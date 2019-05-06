import React from "react";

interface IProps {
  editing?: boolean;
  value: string;
  setValue: (value: string) => void;
  options: { [key: string]: string };
}

export default function TextOrSelect(props: IProps) {
  return props.editing ? (
    <select
      value={props.value}
      onChange={e => {
        props.setValue(e.target.value);
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
