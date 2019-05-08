import React from "react";
import SearchTextInput from "./SearchTextInput";

interface IProps {
  editing?: boolean;
  text: string;
  queryPath: string;
  updateValue: (value: any) => void;
  placeholder?: string;
  autoFocus?: boolean;
  allowBlank?: boolean;
  addBox?: boolean;
}

export default function TextOrSearchInput(props: IProps) {
  return props.editing ? (
    <SearchTextInput {...props} />
  ) : (
    <span>{props.text}</span>
  );
}
