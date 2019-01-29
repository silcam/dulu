import React from "react";
import PropTypes from "prop-types";

export default function ProgressBar(props) {
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

ProgressBar.propTypes = {
  percent: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  small: PropTypes.bool
};
