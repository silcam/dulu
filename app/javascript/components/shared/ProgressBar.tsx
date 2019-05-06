import React from "react";

interface IProps {
  percent: number;
  color: string;
  small?: boolean;
}

export default function ProgressBar(props: IProps) {
  const width = `${props.percent}%`;
  return (
    <div
      style={{
        display: "inline-block",
        width: props.small ? "40px" : "100px",
        height: props.small ? "4px" : "15px",
        backgroundColor: "#ddd"
      }}
    >
      <div
        style={{ width: width, height: "100%", backgroundColor: props.color }}
      />
    </div>
  );
}
