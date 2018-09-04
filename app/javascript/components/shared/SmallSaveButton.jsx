import React from "react";

import SaveButton from "./SaveButton";

/*
    Required props:
        function handleClick(e)
        boolean saveInProgress
        strings
    Optional props:
        boolean disabled
*/

function SmallSaveButton(props) {
  return (
    <SaveButton
      handleClick={props.handleClick}
      saveInProgress={props.saveInProgress}
      disabled={props.disabled}
      extraClasses="btn-sm"
      strings={props.strings}
    />
  );
}

export default SmallSaveButton;
