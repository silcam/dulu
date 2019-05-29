import React from "react";

interface IProps {
  value?: boolean;
  label: string;
}

export default function ReadonlyCheck(props: IProps) {
  return (
    <label>
      <input type="checkbox" checked={!!props.value} readOnly />
      {props.label}
    </label>
  );
}
