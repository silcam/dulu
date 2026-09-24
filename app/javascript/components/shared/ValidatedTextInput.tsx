import React, { useContext, useState } from "react";

import TextInput, { IProps as TextInputProps } from "./TextInput";
import I18nContext from "../../contexts/I18nContext";
import { Translate } from "../../i18n/i18n";

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

// `undefined` rather than `null` for "no error": TextInput declares
// `errorMessage?: string` and guards on it twice with a plain truthiness check, so the two
// render identically -- but only `undefined` is a value the prop admits. The `any` return
// on `t` was what let `null` through here. See 8d.
function makeErrorMessage(props: IProps, showError: boolean, t: Translate) {
  if (!showError && !props.showError) {
    return undefined;
  }
  if (props.validateNotBlank && props.value.length == 0) {
    return t("validation.Not_blank");
  }
  return undefined;
}
