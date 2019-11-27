import React from "react";
import EditActionBar from "../shared/EditActionBar";
import TextOrEditText from "../shared/TextOrEditText";
import SaveIndicator from "../shared/SaveIndicator";
import PersonBasicInfo from "./PersonBasicInfo";
import DangerButton from "../shared/DangerButton";
import { fullName, IPerson } from "../../models/Person";
import update from "immutability-helper";
import ParticipantsTable from "./ParticipantsTable";
import DuluAxios from "../../util/DuluAxios";
import RolesTable from "./RolesTable";
import Loading from "../shared/Loading";
import OrgPeopleContainer from "./OrgPeopleContainer";
import PersonEventsContainer from "./PersonEventsContainer";
import { Setter } from "../../models/TypeBucket";
import { Locale, T } from "../../i18n/i18n";
import { History } from "history";
import DuluSettings from "./DuluSettings";
// import styles from "./PersonPage.css";

interface IProps {
  id: number;
  person: IPerson;
  setPerson: Setter<IPerson>;
  deletePerson: (id: number) => void;
  t: T;
  updateLanguage: (locale: Locale) => void;
  history: History;
}

interface IState {
  person?: IPerson;
  editing?: boolean;
  saving?: boolean;
  deleting?: boolean;
  savedChanges?: boolean;
  edited?: boolean;
}

export default class PersonPage extends React.PureComponent<IProps, IState> {
  state: IState = {};

  async componentDidMount() {
    const data = await DuluAxios.get(`/api/people/${this.props.id}`);
    if (data) {
      this.props.setPerson(data.person);
    }
  }

  edit = () =>
    this.setState({
      editing: true,
      savedChanges: false,
      edited: false,
      person: { ...this.props.person }
    });

  cancelEdit = () => this.setState({ editing: false, person: undefined });

  updatePerson = (mergePerson: Partial<IPerson>) => {
    this.setState(prevState => ({
      edited: true,
      person: update(prevState.person, { $merge: mergePerson })
    }));
  };

  save = async () => {
    if (!this.state.person || !this.validate()) return;
    const data = await DuluAxios.put(`/api/people/${this.state.person.id}`, {
      person: this.state.person
    });
    if (data) {
      this.props.setPerson(data.person);
      this.setStateAfterSave();
      this.updateLanguageIfNecessary();
    }
  };

  updatePersonAndSave = (mergePerson: Partial<IPerson>) => {
    this.setState(
      {
        person: update(this.props.person, { $merge: mergePerson })
      },
      () => {
        this.save();
      }
    );
  };

  updateLanguageIfNecessary = () => {
    if (
      this.props.person.isUser &&
      this.props.person.ui_language != this.props.t.locale
    )
      this.props.updateLanguage(this.props.person.ui_language);
  };

  deletePerson = async () => {
    const success = await DuluAxios.delete(
      `/api/people/${this.props.person.id}`
    );
    if (success) {
      this.props.history.push("/people");
      this.props.deletePerson(this.props.person.id);
    }
  };

  validate = () => {
    const person = this.state.person;
    return (
      person &&
      person.first_name.length > 0 &&
      person.last_name.length > 0 &&
      (!person.has_login || person.email.length > 0)
    );
  };

  setStateAfterSave = () => {
    this.setState({
      editing: false,
      edited: false,
      saving: false,
      savedChanges: true,
      person: undefined
    });
  };

  replaceRoles = (newRoles: string[]) => {
    const newPerson = update(this.props.person, {
      roles: { $set: newRoles }
    });
    this.setState({
      person: newPerson
    });
    this.props.setPerson(newPerson);
  };

  render() {
    const person = this.state.editing ? this.state.person : this.props.person;

    if (!person || person.id == 0) return <Loading />;

    return (
      <div className="padBottom">
        <EditActionBar
          can={person.can}
          editing={this.state.editing}
          saveDisabled={!this.state.edited}
          edit={this.edit}
          delete={() => this.setState({ deleting: true })}
          save={this.save}
          cancel={this.cancelEdit}
        />

        {this.state.deleting && (
          <DangerButton
            handleClick={this.deletePerson}
            handleCancel={() => this.setState({ deleting: false })}
            message={this.props.t("delete_person_warning", {
              name: fullName(person)
            })}
            buttonText={this.props.t("delete_person", {
              name: fullName(person)
            })}
          />
        )}

        <SaveIndicator
          saving={this.state.saving}
          saved={this.state.savedChanges}
        />

        <h2>
          <TextOrEditText
            editing={this.state.editing}
            name="first_name"
            value={person.first_name}
            setValue={value => this.updatePerson({ first_name: value })}
            validateNotBlank
          />
          {!this.state.editing && " "}
          <TextOrEditText
            editing={this.state.editing}
            name="last_name"
            value={person.last_name}
            setValue={value => this.updatePerson({ last_name: value })}
            validateNotBlank
          />
        </h2>

        <PersonBasicInfo
          person={person}
          editing={this.state.editing}
          updatePerson={this.updatePerson}
        />

        <OrgPeopleContainer person={person} />

        <RolesTable person={person} replaceRoles={this.replaceRoles} />

        <ParticipantsTable person={person} />

        <PersonEventsContainer
          person={person}
          history={this.props.history}
          basePath={`/people/${this.props.id}`}
        />

        {person.isUser && !this.state.editing && (
          <DuluSettings
            person={person}
            updatePersonAndSave={this.updatePersonAndSave}
          />
        )}
      </div>
    );
  }
}
