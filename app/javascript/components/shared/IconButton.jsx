import React from "react";

/*
    Required props:
        function handleClick
        string icon
    Optional props:
        string text
        string extraClasses
*/

function IconButton(props) {
  const className = "iconButton " + (props.extraClasses || "");
  const glyphClass = "glyphicon glyphicon-" + props.icon;
  return (
    <button className={className} onClick={props.handleClick}>
      <span className={glyphClass} />
      {props.text && (
        <span>
          &nbsp;
          <u>{props.text}</u>
        </span>
      )}
    </button>
  );
}

export default IconButton;
