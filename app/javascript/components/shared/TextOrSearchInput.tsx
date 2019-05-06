import React from "react";
import SearchTextInput from "./SearchTextInput";

interface IProps {
  editing?: boolean;
  text: string;
}

export default function TextOrSearchInput(props: IProps) {
  return props.editing ? (
    <SearchTextInput {...props} />
  ) : (
    <span>{props.text}</span>
  );
}
