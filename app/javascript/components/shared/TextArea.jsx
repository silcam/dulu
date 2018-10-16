import React from "react";
import PropTypes from "prop-types";

export default function TextArea(props) {
  const rows = props.rows || 4;
  return (
    <div>
      <textarea
        rows={rows}
        name={props.name}
        onChange={props.handleInput}
        value={props.value}
      />
    </div>
  );
}

TextArea.propTypes = {
  handleInput: PropTypes.func.isRequired,
  value: PropTypes.string,
  name: PropTypes.string,
  // optional
  rows: PropTypes.number
};
