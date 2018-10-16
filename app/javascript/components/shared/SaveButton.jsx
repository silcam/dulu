import React from "react";
import PropTypes from "prop-types";

export default function SaveButton(props) {
  const text = props.saveInProgress ? props.t("Saving") : props.t("Save");
  const disabled = (props.disabled || props.saveInProgress) && "disabled";
  return (
    <button onClick={props.handleClick} disabled={disabled}>
      {text}
    </button>
  );
}

SaveButton.propTypes = {
  saveInProgress: PropTypes.bool,
  disabled: PropTypes.bool,
  t: PropTypes.func,
  handleClick: PropTypes.func
};
