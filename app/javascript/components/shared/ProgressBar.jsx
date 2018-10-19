import React from "react";
import PropTypes from "prop-types";

export default function ProgressBar(props) {
  const width = `${props.percent}%`;
  return (
    <div
      style={{
        display: "inline-block",
        width: "100px",
        height: "15px",
        backgroundColor: "#ddd"
      }}
    >
      <div
        style={{ width: width, height: "100%", backgroundColor: props.color }}
      />
    </div>
  );
}

ProgressBar.propTypes = {
  percent: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired
};
