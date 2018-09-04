import axios from "axios";
import React from "react";

import CloseIconButton from "../../shared_components/CloseIconButton";
import {
  SelectGroup,
  ValidatedTextInputGroup
} from "../../shared_components/formGroup";
import SaveButton from "../../shared_components/SaveButton";

import selectOptionsFromObject from "../../util/selectOptionsFromObject";

import DuplicateWarning from "./DuplicateWarning";

class NewPersonForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      person: {
        first_name: "",
        last_name: "",
        gender: "M",
        has_login: false,
        email: "",
        ui_language: "en"
      },
      saving: false,
      failedSave: false
    };
  }

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
      this.setState({ saving: true });
      axios
        .post("/api/people", {
          authenticity_token: this.props.authToken,
          person: this.state.person
        })
        .then(response => {
          if (response.data.duplicatePerson) {
            this.setState({
              duplicatePerson: response.data.duplicatePerson,
              saving: false
            });
          } else {
            this.props.addPerson(response.data);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  clickClose = () => {
    this.props.setSelection(null);
  };

  render() {
    const strings = this.props.strings;
    const person = this.state.person;
    return (
      <div onKeyDown={this.handleKeyDown}>
        <h3 style={{ color: "#aaa" }}>
          <CloseIconButton handleClick={this.clickClose} />
        </h3>

        <h3>{strings.New_person}</h3>

        <ValidatedTextInputGroup
          handleInput={this.handleInput}
          name="first_name"
          label={strings.First_name}
          value={person.first_name}
          strings={strings}
          validateNotBlank
          showError={this.state.failedSave}
          autoFocus
        />

        <ValidatedTextInputGroup
          handleInput={this.handleInput}
          name="last_name"
          label={strings.Last_name}
          value={person.last_name}
          strings={strings}
          validateNotBlank
          showError={this.state.failedSave}
        />

        <SelectGroup
          handleChange={this.handleInput}
          name="gender"
          label={strings.Gender}
          value={person.gender}
          options={selectOptionsFromObject(strings.genders)}
        />

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="has_login"
              checked={person.has_login}
              onChange={this.handleCheck}
            />
            &nbsp;
            {strings.Can_login}
          </label>
        </div>

        {person.has_login && (
          <div>
            <ValidatedTextInputGroup
              handleInput={this.handleInput}
              name="email"
              label={strings.Email}
              value={person.email}
              strings={strings}
              validateNotBlank
              showError={this.state.failedSave}
            />

            <SelectGroup
              handleChange={this.handleInput}
              name="ui_language"
              label={strings.dulu_preferred_language}
              value={person.ui_language}
              options={selectOptionsFromObject(strings.languages)}
            />
          </div>
        )}

        {this.state.duplicatePerson && (
          <DuplicateWarning
            strings={strings}
            duplicatePerson={this.state.duplicatePerson}
            not_a_duplicate={person.not_a_duplicate}
            handleCheck={this.handleCheck}
          />
        )}
        <p>
          <SaveButton
            handleClick={this.clickSave}
            saveInProgress={this.state.saving}
            strings={strings}
          />
        </p>
      </div>
    );
  }
}

export default NewPersonForm;
