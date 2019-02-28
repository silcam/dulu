import React, { useContext } from "react";
import PropTypes from "prop-types";
import I18nContext from "../../application/I18nContext";

export default function SmallSaveAndCancel(props) {
  const t = useContext(I18nContext);

  const style = props.style || {};
  const saveCaption = props.saveInProgress
    ? t("Saving")
    : props.saveCaption || t("Save");
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
        {t("Cancel")}
      </button>
    </div>
  );
}

SmallSaveAndCancel.propTypes = {
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  saveDisabled: PropTypes.bool,
  saveInProgress: PropTypes.bool,
  style: PropTypes.object,
  saveCaption: PropTypes.string
};
