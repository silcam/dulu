import React from "react";
import PropTypes from "prop-types";

export default function TextArea(props) {
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

TextArea.propTypes = {
  setValue: PropTypes.func.isRequired,
  value: PropTypes.string,
  name: PropTypes.string,
  // optional
  rows: PropTypes.number
};
