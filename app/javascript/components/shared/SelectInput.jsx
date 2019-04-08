import React from "react";
import PropTypes from "prop-types";

export default function SelectInput(props) {
  const className = "form-control " + props.extraClasses;
  const name = props.name || "basic_select";

  return (
    <select
      className={className}
      name={name}
      value={props.value}
      autoFocus={props.autoFocus || false}
      onChange={e => props.setValue(e.target.value)}
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

SelectInput.translatedOptions = (options, t, keyPrefix) =>
  options.map(option => ({
    value: option,
    display: keyPrefix ? t(`${keyPrefix}.${option}`) : t(option)
  }));

SelectInput.propTypes = {
  setValue: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  options: PropTypes.array.isRequired, // [{value: v, display: d} ... ]
  // optional
  name: PropTypes.string,
  autoFocus: PropTypes.bool,
  extraClasses: PropTypes.string,
  onBlur: PropTypes.func
};
