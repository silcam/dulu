import React from "react";

function SaveIndicator(props) {
  if (!props.saving && !props.saved) return null;

  return (
    <p className="alertBox alertYellow">
      {props.saving ? props.t("Saving") : props.t("All_changes_saved")}
    </p>
  );
}

export default SaveIndicator;
