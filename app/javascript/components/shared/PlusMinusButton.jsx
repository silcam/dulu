import React from "react";
import PropTypes from "prop-types";
import style from "./PlusMinusButton.css";

export default function PlusMinusButton(props) {
  return (
    <button className={style.plusMinusBtn} onClick={props.handleClick}>
      {props.isExpanded ? "‒" : "+"}
    </button>
  );
}

PlusMinusButton.propTypes = {
  isExpanded: PropTypes.bool,
  handleClick: PropTypes.func.isRequired
};
