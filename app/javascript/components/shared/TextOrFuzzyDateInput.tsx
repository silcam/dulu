import React from "react";
import FuzzyDateInput from "./FuzzyDateInput";

interface IProps {
  editing?: boolean;
  date: string;
}

export default function TextOrFuzzyDateInput(props: IProps) {
  return props.editing ? (
    <FuzzyDateInput {...props} />
  ) : (
    <span>{props.date}</span>
  );
}
