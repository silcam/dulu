import React from "react";
import PropTypes from "prop-types";

/*
    Required props:
        handleInput(e)
        string value
        string name

    Optional props:
        string placeholder
        string errorMessage
        function handleEnter
        function handleBlur
        string extraClasses
        bool autoFocus
*/

export default function TextInput(props) {
  const handleKeyDown = e => {
    if (e.key == "Enter" && props.handleEnter) {
      props.handleEnter();
    }
  };

  const value = props.value || "";
  const divClass = props.errorMessage ? "errorMessage" : "";
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
      <div className="inputMessage">{props.errorMessage}</div>
    </div>
  );
}

TextInput.propTypes = {
  handleInput: PropTypes.func,
  value: PropTypes.string,
  name: PropTypes.string,
  // Optional
  handleEnter: PropTypes.func,
  handleBlur: PropTypes.func,
  placeholder: PropTypes.string,
  errorMessage: PropTypes.string,
  extraClasses: PropTypes.string,
  autoFocus: PropTypes.bool
};
