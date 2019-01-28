import React from "react";
import PropTypes from "prop-types";
import {
  SelectGroup,
  ValidatedTextInputGroup,
  CheckboxGroup
} from "../shared/formGroup";
import SaveButton from "../shared/SaveButton";
import selectOptionsFromObject from "../../util/selectOptionsFromObject";
import DuplicateWarning from "./DuplicateWarning";
import CancelButton from "../shared/CancelButton";

export default class NewPersonForm extends React.Component {
  state = {
    person: {
      first_name: "",
      last_name: "",
      gender: "M",
      has_login: false,
      email: "",
      ui_language: "en"
    },
    failedSave: false
  };

  handleInput = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevState => {
      let person = prevState.person;
      person[name] = value;
      return { person: person };
    });
  };

  handleCheck = e => {
    const name = e.target.name;
    const checked = e.target.checked;
    this.setState(prevState => {
      let person = prevState.person;
      person[name] = checked;
      return { person: person };
    });
  };

  handleKeyDown = e => {
    if (e.key == "Enter") {
      this.clickSave();
    }
  };

  inputValid = () => {
    const person = this.state.person;
    return (
      person.first_name.length > 0 &&
      person.last_name.length > 0 &&
      (!person.has_login || person.email.length > 0)
    );
  };

  clickSave = () => {
    if (!this.inputValid()) {
      this.setState({ failedSave: true });
    } else {
      this.props.addPerson(this.state.person);
    }
  };

  render() {
    const t = this.props.t;
    const person = this.state.person;
    return (
      <div onKeyDown={this.handleKeyDown}>
        <h3>{t("New_person")}</h3>

        <ValidatedTextInputGroup
          handleInput={this.handleInput}
          name="first_name"
          label={t("First_name")}
          value={person.first_name}
          t={t}
          validateNotBlank
          showError={this.state.failedSave}
          autoFocus
        />

        <ValidatedTextInputGroup
          handleInput={this.handleInput}
          name="last_name"
          label={t("Last_name")}
          value={person.last_name}
          t={t}
          validateNotBlank
          showError={this.state.failedSave}
        />

        <SelectGroup
          handleChange={this.handleInput}
          name="gender"
          label={t("Gender")}
          value={person.gender}
          options={selectOptionsFromObject(t("genders"))}
        />

        <CheckboxGroup
          label={t("Dulu_account")}
          handleCheck={this.handleCheck}
          name="has_login"
          value={person.has_login}
          text={t("Can_login")}
        />

        {person.has_login && (
          <div>
            <ValidatedTextInputGroup
              handleInput={this.handleInput}
              name="email"
              label={t("Email")}
              value={person.email}
              t={t}
              validateNotBlank
              showError={this.state.failedSave}
            />

            <SelectGroup
              handleChange={this.handleInput}
              name="ui_language"
              label={t("dulu_preferred_language")}
              value={person.ui_language}
              options={selectOptionsFromObject(t("languages"))}
            />
          </div>
        )}

        {this.props.duplicatePerson && (
          <DuplicateWarning
            t={t}
            duplicatePerson={this.props.duplicatePerson}
            not_a_duplicate={person.not_a_duplicate}
            handleCheck={this.handleCheck}
          />
        )}
        <p>
          <SaveButton
            handleClick={this.clickSave}
            saveInProgress={this.props.saving}
            disabled={this.props.duplicatePerson && !person.not_a_duplicate}
            t={t}
          />

          <CancelButton t={t} />
        </p>
      </div>
    );
  }
}

NewPersonForm.propTypes = {
  duplicatePerson: PropTypes.bool,
  t: PropTypes.func,
  addPerson: PropTypes.func,
  saving: PropTypes.bool
};
