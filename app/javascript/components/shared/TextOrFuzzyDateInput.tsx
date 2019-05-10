import React from "react";
import FuzzyDateInput, {
  IProps as FuzzyDateInputProps
} from "./FuzzyDateInput";

interface IProps extends FuzzyDateInputProps {
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
