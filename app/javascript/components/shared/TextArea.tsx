import React, { useRef, useEffect } from "react";

export interface IProps {
  setValue: (value: string) => void;
  value: string;
  name?: string;
  rows?: number;
}

export default function TextArea(props: IProps) {
  // const rows = props.rows || 4;
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight + 2}px`;
    }
  });

  return (
    <div>
      <textarea
        ref={ref}
        name={props.name}
        onChange={e => props.setValue(e.target.value)}
        value={props.value || ""}
        style={{ resize: "none" }}
      />
    </div>
  );
}
