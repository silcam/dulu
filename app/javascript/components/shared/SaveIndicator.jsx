import React from "react";
import PropTypes from "prop-types";
import AlertBox from "./AlertBox";

export default function SaveIndicator(props) {
  if (!props.saving && !props.saved) return null;

  return (
    <AlertBox
      text={props.saving ? props.t("Saving") : props.t("All_changes_saved")}
    />
  );
}

SaveIndicator.propTypes = {
  saving: PropTypes.bool,
  saved: PropTypes.bool,
  t: PropTypes.func.isRequired
};
