import React from "react";
import PropTypes from "prop-types";

export default function ProgressBarMulti(props) {
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

function width(number) {
  return `${Math.round(number)}%`;
}

ProgressBarMulti.propTypes = {
  bars: PropTypes.array.isRequired
};

/*
  Sample bars:
  [
    { percent: 10, color: "#ff0000", tooltip: "Drafting: 15%" },
    ...
  ]

*/
