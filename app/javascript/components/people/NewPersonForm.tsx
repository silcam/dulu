import React from "react";
import SaveButton from "../shared/SaveButton";
import DuplicateWarning, { Duplicate } from "./DuplicateWarning";
import CancelButton from "../shared/CancelButton";
import { IPerson } from "../../models/Person";
import update from "immutability-helper";
import FormGroup from "../shared/FormGroup";
import ValidatedTextInput from "../shared/ValidatedTextInput";
import SelectInput from "../shared/SelectInput";
import CheckBoxInput from "../shared/CheckboxInput";
import List from "../../models/List";
import { History } from "history";
import { emptyPerson } from "../../reducers/peopleReducer";
import I18nContext from "../../contexts/I18nContext";
import { Locale } from "../../i18n/i18n";
import { ICan } from "../../actions/canActions";
import useLoad from "../shared/useLoad";

interface IProps {
  people: List<IPerson>;
  can: ICan;

  history: History;
}

interface IState {
  person: IPerson;
  duplicates?: Duplicate[];
  failedSave: boolean;
  saving: boolean;
}

export default function NewPersonForm(props: IProps) {
  const [saveLoad] = useLoad();

  const save = async (
    person: IPerson,
    setDuplicates: (d: Duplicate[]) => void
  ) => {
    saveLoad(async duluAxios => {
      const data = await duluAxios.post("/api/people", { person });
      if (data) {
        if (data.people) props.history.push(`/people/${data.people[0].id}`);
        else setDuplicates(data.duplicates);
      }
      return data;
    });
  };
  return <OldNewPersonForm save={save} {...props} />;
}

interface OldIProps extends IProps {
  save: (
    person: IPerson,
    setDuplicates: (d: Duplicate[]) => void
  ) => Promise<void>;
}

class OldNewPersonForm extends React.Component<OldIProps, IState> {
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
      this.save();
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

  save = async () => {
    this.setState({ saving: true });
    await this.props.save(this.state.person, duplicates =>
      this.setState({ duplicates })
    );
    this.setState({ saving: false });
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
                  this.updatePerson({ gender: gender as "M" | "F" })
                }
                name="gender"
                value={person.gender}
                options={SelectInput.fromObjectOptions(t("genders"))}
              />
            </FormGroup>

            {this.props.can.grant_login && (
              <FormGroup label={t("Dulu_account")}>
                <CheckBoxInput
                  setValue={value => this.updatePerson({ has_login: value })}
                  name="has_login"
                  value={!!person.has_login}
                  text={t("Can_login")}
                />
              </FormGroup>
            )}

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
                    options={SelectInput.fromObjectOptions(t("languages"))}
                  />
                </FormGroup>
              </div>
            )}

            {this.state.duplicates && (
              <DuplicateWarning
                duplicates={this.state.duplicates}
                newPerson={person}
                setNewPerson={this.updatePerson}
              />
            )}
            <p>
              <SaveButton
                onClick={() => this.save()}
                saveInProgress={this.state.saving}
                disabled={
                  !this.inputValid() ||
                  (this.state.duplicates && !person.not_a_duplicate)
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
