import React from "react";
import AddIcon from "./AddIcon";
import { IconProps } from "./Icon";

export default function InlineAddIcon(props: IconProps) {
  return (
    <AddIcon
      {...props}
      svgStyle={{
        verticalAlign: "baseline",
        marginBottom: "-5px",
        marginLeft: "4px"
      }}
    />
  );
}
