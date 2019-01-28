import React from "react";

import CancelButton from "./CancelButton";

/*
    Required props:
        function handleClick
        strings
*/

function SmallCancelButton(props) {
  return (
    <CancelButton
      handleClick={props.handleClick}
      extraClasses="btn-sm"
      t={props.t}
    />
  );
}

export default SmallCancelButton;
