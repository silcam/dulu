import React from "react";
import PropTypes from "prop-types";

export default function SmallSaveAndCancel(props) {
  const style = props.style || {};
  return (
    <div style={style}>
      <button
        onClick={props.handleSave}
        // saveInProgress={props.saveInProgress}
        disabled={props.saveDisabled && "disabled"}
        style={{ fontSize: "11px" }}
      >
        {props.saveCaption || props.t("Save")}
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
  style: PropTypes.object,
  saveCaption: PropTypes.string
};
