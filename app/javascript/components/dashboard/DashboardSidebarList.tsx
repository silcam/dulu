import React, { useState } from "react";
import DashboardSidebarItem from "./DashboardSidebarItem";

interface IProps {
  header: string;
  indent: number;
  selected: boolean;
  onClick: () => void;
  startExpanded?: boolean;
  children: JSX.Element[];
}

export default function DashboardSidebarList(props: IProps) {
  const { startExpanded, children, onClick, ...otherProps } = props;
  const [expanded, setExpanded] = useState(startExpanded || props.selected);

  return (
    <React.Fragment>
      <DashboardSidebarItem
        {...otherProps}
        expanded={expanded}
        toggleExpand={() => setExpanded(!expanded)}
        onClick={() => {
          onClick();
          setExpanded(true);
        }}
      />
      {expanded && children}
    </React.Fragment>
  );
}
