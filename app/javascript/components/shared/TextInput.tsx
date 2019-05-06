import React from "react";
import styles from "./TextInput.css";

export interface IProps {
  setValue: (value: string) => void;
  value: string;
  name?: string;
  handleEnter?: () => void;
  handleKeyDown?: (key: string) => void;
  handleBlur?: () => void;
  placeholder?: string;
  errorMessage?: string;
  extraClasses?: string;
  autoFocus?: boolean;
}

export default function TextInput(props: IProps) {
  const handleKeyDown = (key: string) => {
    if (props.handleKeyDown) props.handleKeyDown(key);
    if (key == "Enter" && props.handleEnter) {
      props.handleEnter();
    }
  };

  const value = props.value || "";
  const divClass = props.errorMessage ? styles.errorMessage : "";
  const inputClass = props.extraClasses ? props.extraClasses : "";
  const autoFocus = props.autoFocus || false;

  return (
    <div className={divClass}>
      <input
        type="text"
        className={inputClass}
        name={props.name}
        onChange={e => props.setValue(e.target.value)}
        onKeyDown={e => handleKeyDown(e.key)}
        placeholder={props.placeholder}
        value={value}
        onBlur={props.handleBlur}
        autoFocus={autoFocus}
      />
      {props.errorMessage && (
        <div style={{ marginTop: "4px" }}>{props.errorMessage}</div>
      )}
    </div>
  );
}
