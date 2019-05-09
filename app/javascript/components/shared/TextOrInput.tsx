import React from "react";

interface IProps {
  editing?: boolean;
  text: string;
  children: JSX.Element;
}

export default function TextOrInput(props: IProps) {
  return props.editing ? props.children : <span>{props.text}</span>;
}
