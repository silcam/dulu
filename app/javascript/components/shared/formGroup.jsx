import React from "react";
import PropTypes from "prop-types";
import SelectInput from "./SelectInput";
import TextArea from "./TextArea";
import TextInput from "./TextInput";
import ValidatedTextInput from "./ValidatedTextInput";
import FuzzyDateInput from "./FuzzyDateInput";
import SearchTextInput from "./SearchTextInput";
import styles from "./formGroup.css";
import CheckBoxInput from "./CheckboxInput";

function formGroup(WrappedInput) {
  return class extends React.PureComponent {
    render() {
      const { label, ...otherProps } = this.props;
      return (
        <div className={styles.formGroup}>
          <label>{label}</label>
          <WrappedInput {...otherProps} />
        </div>
      );
    }
  };
}

formGroup.propTypes = {
  label: PropTypes.string
};

const CheckboxGroup = formGroup(CheckBoxInput);
const FuzzyDateGroup = formGroup(FuzzyDateInput);
const SearchTextGroup = formGroup(SearchTextInput);
const SelectGroup = formGroup(SelectInput);
const TextAreaGroup = formGroup(TextArea);
const TextInputGroup = formGroup(TextInput);
const ValidatedTextInputGroup = formGroup(ValidatedTextInput);

export {
  formGroup,
  CheckboxGroup,
  FuzzyDateGroup,
  SelectGroup,
  SearchTextGroup,
  TextAreaGroup,
  TextInputGroup,
  ValidatedTextInputGroup
};
