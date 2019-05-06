import React from "react";
import TextArea, { IProps as TextAreaProps } from "./TextArea";
import FormGroup from "./FormGroup";

interface IProps extends TextAreaProps {
  editing?: boolean;
  label?: string;
}

export default function TextOrTextArea(props: IProps) {
  const { editing, label, ...otherProps } = props;
  return props.editing ? (
    <FormGroup label={props.label}>
      <TextArea {...otherProps} />
    </FormGroup>
  ) : (
    <span>{props.value}</span>
  );
}
