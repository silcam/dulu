import React from "react";

interface IProps {
  bars: Array<{
    percent: number;
    color: string;
    tooltip?: string;
  }>;
}

export default function ProgressBarMulti(props: IProps) {
  return (
    <div
      style={{
        display: "inline-block",
        width: "100px",
        height: "15px",
        backgroundColor: "#ddd",
        overflowX: "hidden"
      }}
    >
      {props.bars.map((bar, index) => (
        <div
          key={index}
          style={{
            display: "inline-block",
            width: width(bar.percent),
            height: "100%",
            backgroundColor: bar.color
          }}
          title={bar.tooltip ? bar.tooltip : undefined}
        />
      ))}
    </div>
  );
}

function width(number: number) {
  return `${Math.round(number)}%`;
}
