import React from "react";
import PropTypes from "prop-types";

export default function SmallSaveAndCancel(props) {
  const style = props.style || {};
  const saveCaption = props.saveInProgress
    ? props.t("Saving")
    : props.saveCaption || props.t("Save");
  const saveDisabled =
    (props.saveDisabled || props.saveInProgress) && "disabled";
  return (
    <div style={style}>
      <button
        onClick={props.handleSave}
        disabled={saveDisabled}
        style={{ fontSize: "11px" }}
      >
        {saveCaption}
      </button>
      <button
        onClick={props.handleCancel}
        className="btnRed"
        style={{ fontSize: "11px" }}
      >
        {props.t("Cancel")}
      </button>
    </div>
  );
}

SmallSaveAndCancel.propTypes = {
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  saveDisabled: PropTypes.bool,
  saveInProgress: PropTypes.bool,
  style: PropTypes.object,
  saveCaption: PropTypes.string
};
