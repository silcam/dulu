import React from "react";

interface IProps {
  width: string;
}

export default function Spacer(props: IProps) {
  return <span style={{ display: "inline-block", width: props.width }} />;
}
