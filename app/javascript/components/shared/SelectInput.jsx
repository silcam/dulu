import React from "react";

/*
    Required props:
        -handleChange(e)
        -value
        -options - array of objects with display member and optional value member
    Optional props:
        -extraClasses
        -autoFocus
        -name
        -onBlur

*/

function SelectInput(props) {
  const className = "form-control " + props.extraClasses;
  const name = props.name || "basic_select";
  return (
    <select
      className={className}
      name={name}
      value={props.value}
      autoFocus={props.autoFocus || false}
      onChange={props.handleChange}
      onBlur={props.onBlur}
    >
      {props.options.map(option => {
        const value = option.value || option.display;
        return (
          <option key={value} value={value}>
            {option.display}
          </option>
        );
      })}
    </select>
  );
}

export default SelectInput;
