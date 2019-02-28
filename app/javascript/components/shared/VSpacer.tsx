import React from "react";

interface IProps {
  height: number;
}

export default function VSpacer(props: IProps) {
  return <div style={{ height: `${props.height}px` }} />;
}
