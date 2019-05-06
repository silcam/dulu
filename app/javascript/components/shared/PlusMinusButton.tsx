import React from "react";
import style from "./PlusMinusButton.css";

interface IProps {
  isExpanded?: boolean;
  handleClick: () => void;
}

export default function PlusMinusButton(props: IProps) {
  return (
    <button className={style.plusMinusBtn} onClick={props.handleClick}>
      {props.isExpanded ? "‒" : "+"}
    </button>
  );
}
