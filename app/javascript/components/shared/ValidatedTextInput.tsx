import React, { useContext, useState } from "react";

import TextInput, { IProps as TextInputProps } from "./TextInput";
import I18nContext from "../../contexts/I18nContext";
import { T } from "../../i18n/i18n";

export interface IProps extends TextInputProps {
  showError?: boolean;
  validateNotBlank?: boolean;
}

export default function ValidatedTextInput(props: IProps) {
  const t = useContext(I18nContext);

  const [showError, setShowError] = useState(false);

  const errorMessage = makeErrorMessage(props, showError, t);

  const { setValue, ...otherProps } = props;

  return (
    <TextInput
      {...otherProps}
      setValue={value => {
        setShowError(true);
        setValue(value);
      }}
      errorMessage={errorMessage}
    />
  );
}

function makeErrorMessage(props: IProps, showError: boolean, t: T) {
  if (!showError && !props.showError) {
    return null;
  }
  if (props.validateNotBlank && props.value.length == 0) {
    return t("validation.Not_blank");
  }
  return null;
}
