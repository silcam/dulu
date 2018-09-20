import React from "react";

/*
    Required Props: 
        function handleClick(e)
        boolean saveInProgress
        strings
    Optional props:
        string extraClasses
        boolean disabled
*/

function SaveButton(props) {
  const text = props.saveInProgress ? props.t("Saving") : props.t("Save");
  const disabled = (props.disabled || props.saveInProgress) && "disabled";
  return (
    <button onClick={props.handleClick} disabled={disabled}>
      {text}
    </button>
  );
}

export default SaveButton;
