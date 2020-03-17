import React from "react";
import style from "./PlusMinusButton.css";

interface IProps {
  isExpanded?: boolean;
  handleClick: () => void;
  withCaret?: boolean;
}

export default function PlusMinusButton(props: IProps) {
  const content = props.withCaret
    ? props.isExpanded
      ? "▲"
      : "▼"
    : props.isExpanded
    ? "‒"
    : "+";
  return (
    <button className={style.plusMinusBtn} onClick={props.handleClick}>
      {content}
    </button>
  );
}
