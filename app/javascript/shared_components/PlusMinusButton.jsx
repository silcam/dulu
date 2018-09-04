import React from "react";

function PlusMinusButton(props) {
  return (
    <button className="plusMinusButton" onClick={props.handleClick}>
      {props.isExpanded ? "‒" : "+"}
    </button>
  );
}

export default PlusMinusButton;
