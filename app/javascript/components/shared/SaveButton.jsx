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
  const classes = "btn btn-primary " + (props.extraClasses || "");
  const disabled = props.disabled ? true : false;
  return (
    <button
      className={classes}
      onClick={props.handleClick}
      disabled={props.saveInProgress || disabled}
    >
      {text}
    </button>
  );
}

export default SaveButton;
