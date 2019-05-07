import React from "react";
import FormGroup from "./FormGroup";
import ValidatedTextInput, {
  IProps as ValidatedTextInputProps
} from "./ValidatedTextInput";

interface IProps extends ValidatedTextInputProps {
  editing?: boolean;
  value: string;
  label?: string; // only displayed in edit mode
}

export default function TextOrEditText(props: IProps) {
  const { editing, label, ...otherProps } = props;
  return editing ? (
    <FormGroup label={label}>
      <ValidatedTextInput {...otherProps} />
    </FormGroup>
  ) : (
    <span>{props.value}</span>
  );
}
