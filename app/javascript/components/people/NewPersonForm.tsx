import React from "react";
import SaveButton from "../shared/SaveButton";
import selectOptionsFromObject from "../../util/selectOptionsFromObject";
import DuplicateWarning from "./DuplicateWarning";
import CancelButton from "../shared/CancelButton";
import DuluAxios from "../../util/DuluAxios";
import { sameName, IPerson } from "../../models/Person";
import update from "immutability-helper";
import FormGroup from "../shared/FormGroup";
import ValidatedTextInput from "../shared/ValidatedTextInput";
import SelectInput from "../shared/SelectInput";
import CheckBoxInput from "../shared/CheckboxInput";
import List from "../../models/List";
import { Setter } from "../../models/TypeBucket";
import { History } from "history";
import { emptyPerson } from "../../reducers/peopleReducer";
import I18nContext from "../../contexts/I18nContext";
import { Locale } from "../../i18n/i18n";

interface IProps {
  people: List<IPerson>;
  addPerson: Setter<IPerson>;

  history: History;
}

interface IState {
  person: IPerson;
  duplicatePerson?: IPerson;
  failedSave: boolean;
  saving: boolean;
}

export default class NewPersonForm extends React.Component<IProps, IState> {
  state: IState = {
    person: emptyPerson,
    failedSave: false,
    saving: false
  };

  updatePerson = (mergePerson: Partial<IPerson>) =>
    this.setState(prevState => ({
      person: update(prevState.person, { $merge: mergePerson })
    }));

  handleKeyDown = (key: string) => {
    if (key == "Enter") {
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
    const person = this.state.person;
    return (
      <I18nContext.Consumer>
        {t => (
          <div onKeyDown={e => this.handleKeyDown(e.key)}>
            <h3>{t("New_person")}</h3>

            <FormGroup label={t("First_name")}>
              <ValidatedTextInput
                setValue={first_name => this.updatePerson({ first_name })}
                name="first_name"
                value={person.first_name}
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
                validateNotBlank
                showError={this.state.failedSave}
              />
            </FormGroup>

            <FormGroup label={t("Gender")}>
              <SelectInput
                setValue={gender =>
                  this.updatePerson({ gender: gender as ("M" | "F") })
                }
                name="gender"
                value={person.gender}
                options={selectOptionsFromObject(t("genders"))}
              />
            </FormGroup>

            <FormGroup label={t("Dulu_account")}>
              <CheckBoxInput
                setValue={value => this.updatePerson({ has_login: value })}
                name="has_login"
                value={!!person.has_login}
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
                    validateNotBlank
                    showError={this.state.failedSave}
                  />
                </FormGroup>

                <FormGroup label={t("dulu_preferred_language")}>
                  <SelectInput
                    setValue={ui_language =>
                      this.updatePerson({ ui_language: ui_language as Locale })
                    }
                    name="ui_language"
                    value={person.ui_language}
                    options={selectOptionsFromObject(t("languages"))}
                  />
                </FormGroup>
              </div>
            )}

            {this.state.duplicatePerson && (
              <DuplicateWarning
                duplicatePerson={this.state.duplicatePerson}
                not_a_duplicate={person.not_a_duplicate}
                handleCheck={value =>
                  this.updatePerson({ not_a_duplicate: value })
                }
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

              <CancelButton />
            </p>
          </div>
        )}
      </I18nContext.Consumer>
    );
  }
}
