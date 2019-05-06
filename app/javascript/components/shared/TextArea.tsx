import React from "react";

export interface IProps {
  setValue: (value: string) => void;
  value: string;
  name?: string;
  rows?: number;
}

export default function TextArea(props: IProps) {
  const rows = props.rows || 4;
  return (
    <div>
      <textarea
        rows={rows}
        name={props.name}
        onChange={e => props.setValue(e.target.value)}
        value={props.value || ""}
      />
    </div>
  );
}
