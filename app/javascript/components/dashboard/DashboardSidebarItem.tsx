import React from "react";
import PlusMinusButton from "../shared/PlusMinusButton";
import styles from "./Dashboard.css";

interface IProps {
  header: string;
  indent: number;
  expanded?: boolean;
  selected: boolean;
  onClick: () => void;
  toggleExpand?: () => void;
}

export default function DashboardSidebarItem(props: IProps) {
  return (
    <li
      style={{ paddingLeft: `${props.indent}px` }}
      className={props.selected ? styles.active : ""}
    >
      {!!props.toggleExpand && (
        <PlusMinusButton
          isExpanded={props.expanded}
          handleClick={props.toggleExpand}
        />
      )}
      <button className="link" onClick={props.onClick}>
        {props.header}
      </button>
    </li>
  );
}
