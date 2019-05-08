import React, { useContext } from "react";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  saveInProgress?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export default function SaveButton(props: IProps) {
  const t = useContext(I18nContext);
  const text = props.saveInProgress ? t("Saving") : t("Save");
  const disabled = props.disabled || props.saveInProgress;
  return (
    <button onClick={props.onClick} disabled={disabled}>
      {text}
    </button>
  );
}
