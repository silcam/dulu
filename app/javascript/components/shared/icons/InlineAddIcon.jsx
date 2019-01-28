import React from "react";
import AddIcon from "./AddIcon";

export default function InlineAddIcon(props) {
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
