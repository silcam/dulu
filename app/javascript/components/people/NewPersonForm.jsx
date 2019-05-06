import React from "react";
import PropTypes from "prop-types";
import SaveButton from "../shared/SaveButton";
import selectOptionsFromObject from "../../util/selectOptionsFromObject";
import DuplicateWarning from "./DuplicateWarning";
import CancelButton from "../shared/CancelButton";
import DuluAxios from "../../util/DuluAxios";
import { sameName } from "../../models/Person";
import update from "immutability-helper";
import FormGroup from "../shared/FormGroup";
import ValidatedTextInput from "../shared/ValidatedTextInput";
import SelectInput from "../shared/SelectInput";
import CheckBoxInput from "../shared/CheckboxInput";

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
    failedSave: false,
    saving: false
  };

  updatePerson = mergePerson =>
    this.setState(prevState => ({
      person: update(prevState.person, { $merge: mergePerson })
    }));

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

  findDuplicate = () => {
    return this.props.people.find(person =>
      sameName(person, this.state.person)
    );
  };

  clickSave = async () => {
    const duplicate = this.findDuplicate();
    if (!this.state.person.not_a_duplicate && duplicate) {
      this.setState({ duplicatePerson: duplicate });
    } else {
      this.save();
    }
  };

  save = async () => {
    this.setState({ saving: true });
    const data = await DuluAxios.post("/api/people", {
      person: this.state.person
    });
    if (data) {
      this.props.addPerson(data.person);
      this.props.history.push(`/people/${data.person.id}`);
    } else {
      this.setState({ saving: false });
    }
  };

  render() {
    const t = this.props.t;
    const person = this.state.person;
    return (
      <div onKeyDown={this.handleKeyDown}>
        <h3>{t("New_person")}</h3>

        <FormGroup label={t("First_name")}>
          <ValidatedTextInput
            setValue={first_name => this.updatePerson({ first_name })}
            name="first_name"
            value={person.first_name}
            t={t}
            validateNotBlank
            showError={this.state.failedSave}
            autoFocus
          />
        </FormGroup>

        <FormGroup label={t("Last_name")}>
          <ValidatedTextInput
            setValue={last_name => this.updatePerson({ last_name })}
            name="last_name"
            value={person.last_name}
            t={t}
            validateNotBlank
            showError={this.state.failedSave}
          />
        </FormGroup>

        <FormGroup label={t("Gender")}>
          <SelectInput
            setValue={gender => this.updatePerson({ gender })}
            name="gender"
            value={person.gender}
            options={selectOptionsFromObject(t("genders"))}
          />
        </FormGroup>

        <FormGroup label={t("Dulu_account")}>
          <CheckBoxInput
            setValue={value => this.updatePerson({ has_login: value })}
            name="has_login"
            value={person.has_login}
            text={t("Can_login")}
          />
        </FormGroup>

        {person.has_login && (
          <div>
            <FormGroup label={t("Email")}>
              <ValidatedTextInput
                setValue={email => this.updatePerson({ email })}
                name="email"
                value={person.email}
                t={t}
                validateNotBlank
                showError={this.state.failedSave}
              />
            </FormGroup>

            <FormGroup label={t("dulu_preferred_language")}>
              <SelectInput
                setValue={ui_language => this.updatePerson({ ui_language })}
                name="ui_language"
                value={person.ui_language}
                options={selectOptionsFromObject(t("languages"))}
              />
            </FormGroup>
          </div>
        )}

        {this.state.duplicatePerson && (
          <DuplicateWarning
            t={t}
            duplicatePerson={this.state.duplicatePerson}
            not_a_duplicate={person.not_a_duplicate}
            handleCheck={this.handleCheck}
          />
        )}
        <p>
          <SaveButton
            onClick={this.clickSave}
            saveInProgress={this.state.saving}
            disabled={
              !this.inputValid() ||
              (this.state.duplicatePerson && !person.not_a_duplicate)
            }
          />

          <CancelButton t={t} />
        </p>
      </div>
    );
  }
}

NewPersonForm.propTypes = {
  people: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  addPerson: PropTypes.func.isRequired,

  history: PropTypes.object.isRequired
};
