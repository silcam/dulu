import React from "react";

import AddButton from "./AddButton";

/*
    Required props:
        function handleClick
        strings
*/

function SmallAddButton(props) {
  return (
    <AddButton
      handleClick={props.handleClick}
      extraClasses="btn-sm"
      t={props.t}
    />
  );
}

export default SmallAddButton;
