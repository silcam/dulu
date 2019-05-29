import React from "react";
import { Children } from "../../models/TypeBucket";

interface IProps {
  children: Children;
}

export default function DivInline(props: IProps) {
  return <div style={{ display: "inline-block" }}>{props.children}</div>;
}
