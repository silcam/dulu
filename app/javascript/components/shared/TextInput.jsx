import React from "react";
import PropTypes from "prop-types";
import styles from "./TextInput.css";

export default function TextInput(props) {
  const handleKeyDown = e => {
    if (props.handleKeyDown) props.handleKeyDown(e.key);
    if (e.key == "Enter" && props.handleEnter) {
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
        onChange={props.handleInput}
        onKeyDown={handleKeyDown}
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

TextInput.propTypes = {
  handleInput: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string,
  // Optional
  handleEnter: PropTypes.func,
  handleKeyDown: PropTypes.func,
  handleBlur: PropTypes.func,
  placeholder: PropTypes.string,
  errorMessage: PropTypes.string,
  extraClasses: PropTypes.string,
  autoFocus: PropTypes.bool
};
