import React from "react";
import PropTypes from "prop-types";
import styles from "./CheckboxInput.css";

export default function CheckBoxInput(props) {
  return (
    <label className={styles.checkbox}>
      <input
        type="checkbox"
        name={props.name}
        checked={props.value}
        onChange={props.handleCheck}
      />
      &nbsp;
      {props.text}
    </label>
  );
}

CheckBoxInput.propTypes = {
  name: PropTypes.string,
  value: PropTypes.bool,
  handleCheck: PropTypes.func,
  text: PropTypes.string
};
