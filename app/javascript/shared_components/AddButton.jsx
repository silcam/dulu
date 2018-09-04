import React from "react";

/*
    Required props:
        function handleClick
        strings or text
    Optional props:
        string extraClasses
*/

function AddButton(props) {
  const text = props.text || props.strings.Add;
  const classes = "btn btn-primary " + (props.extraClasses || "");
  return (
    <button className={classes} onClick={props.handleClick}>
      {text}
    </button>
  );
}

export default AddButton;
