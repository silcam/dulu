import React from "react";
import SearchTextInput from "./SearchTextInput";

export default function TextOrSearchInput(props) {
  return props.editing ? (
    <SearchTextInput
      text={props.text}
      updateValue={props.updateValue}
      queryPath={props.queryPath}
    />
  ) : (
    <span>{props.text}</span>
  );
}
