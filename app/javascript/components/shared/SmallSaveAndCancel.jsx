import React from "react";

import SmallCancelButton from "./SmallCancelButton";
import SmallSaveButton from "./SmallSaveButton";

/*
    Required props:
        function handleSave()
        function handleCancel()
        boolean saveInProgress
        strings
    Optional props:
        boolean floatRight
        boolean saveDisabled
*/

function SmallSaveAndCancel(props) {
  const style = props.floatRight ? { float: "right" } : {};
  return (
    <span style={style}>
      <SmallSaveButton
        handleClick={props.handleSave}
        saveInProgress={props.saveInProgress}
        t={props.t}
        disabled={props.saveDisabled}
      />
      &nbsp;
      <SmallCancelButton handleClick={props.handleCancel} t={props.t} />
    </span>
  );
}

export default SmallSaveAndCancel;
