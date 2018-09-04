import React from "react";

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

function TextInput(props) {
  const handleKeyDown = e => {
    if (e.key == "Enter" && props.handleEnter) {
      props.handleEnter();
    }
  };

  const value = props.value || "";
  const divClass = props.errorMessage
    ? "form-group errorMessage"
    : "form-group";
  const inputClass = props.extraClasses
    ? "form-control " + props.extraClasses
    : "form-control";
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

export default TextInput;
