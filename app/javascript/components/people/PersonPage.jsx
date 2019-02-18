import React from "react";
import PropTypes from "prop-types";
import EditActionBar from "../shared/EditActionBar";
import deepcopy from "../../util/deepcopy";
import TextOrEditText from "../shared/TextOrEditText";
import merge from "deepmerge";
import SaveIndicator from "../shared/SaveIndicator";
import PersonBasicInfo from "./PersonBasicInfo";
import DangerButton from "../shared/DangerButton";
import { fullName } from "../../models/Person";
import update from "immutability-helper";
import ParticipantsTable from "./ParticipantsTable";
import DuluAxios from "../../util/DuluAxios";
import RolesTable from "./RolesTable";
import Loading from "../shared/Loading";
import OrgPeopleContainer from "./OrgPeopleContainer";
import PersonEventsContainer from "./PersonEventsContainer";
// import styles from "./PersonPage.css";

export default class PersonPage extends React.PureComponent {
  state = {};

  async componentDidMount() {
    try {
      const data = await DuluAxios.get(`/api/people/${this.props.id}`);
      this.props.setPerson(data.person);
    } catch (error) {
      this.props.setNetworkError(error);
    }
  }

  edit = () =>
    this.setState({
      editing: true,
      edited: false,
      person: deepcopy(this.props.person)
    });

  cancelEdit = () => this.setState({ editing: false, person: undefined });

  updatePerson = mergePerson => {
    this.setState(prevState => ({
      edited: true,
      person: merge(prevState.person, mergePerson)
    }));
  };

  save = async () => {
    if (!this.validate()) return;
    try {
      const data = await DuluAxios.put(`/api/people/${this.state.person.id}`, {
        person: this.state.person
      });
      this.props.setPerson(data.person);
      this.setStateAfterSave();
      this.updateLanguageIfNecessary();
    } catch (error) {
      this.props.setNetworkError({ tryAgain: this.save });
    }
  };

  updateLanguageIfNecessary = () => {
    if (
      this.props.person.isUser &&
      this.props.person.ui_language != this.props.t.locale
    )
      this.props.updateLanguage(this.props.person.ui_language);
  };

  deletePerson = async () => {
    try {
      await DuluAxios.delete(`/api/people/${this.props.person.id}`);
      this.props.history.push("/people");
      this.props.deletePerson(this.props.person.id);
    } catch (error) {
      this.props.setNetworkError(error);
    }
  };

  validate = () => {
    const person = this.state.person;
    return (
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

  replaceRoles = newRoles => {
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

    if (!person) return <Loading t={this.props.t} />;

    return (
      <div>
        <EditActionBar
          can={person.can}
          editing={this.state.editing}
          saveDisabled={!this.state.edited}
          t={this.props.t}
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
            t={this.props.t}
          />
        )}

        <SaveIndicator
          t={this.props.t}
          saving={this.state.saving}
          saved={this.state.savedChanges}
        />

        <h2>
          <TextOrEditText
            editing={this.state.editing}
            name="first_name"
            value={person.first_name}
            updateValue={value => this.updatePerson({ first_name: value })}
            t={this.props.t}
            validateNotBlank
          />
          {!this.state.editing && " "}
          <TextOrEditText
            editing={this.state.editing}
            value={person.last_name}
            updateValue={value => this.updatePerson({ last_name: value })}
            t={this.props.t}
            validateNotBlank
          />
        </h2>

        <PersonBasicInfo
          t={this.props.t}
          person={person}
          editing={this.state.editing}
          updatePerson={this.updatePerson}
        />

        <OrgPeopleContainer
          t={this.props.t}
          person={person}
          setNetworkError={this.props.setNetworkError}
        />

        <RolesTable
          t={this.props.t}
          person={person}
          replaceRoles={this.replaceRoles}
          setNetworkError={this.props.setNetworkError}
        />

        <ParticipantsTable t={this.props.t} person={person} />

        <PersonEventsContainer
          t={this.props.t}
          person={person}
          setNetworkError={this.props.setNetworkError}
          history={this.props.history}
        />
      </div>
    );
  }
}

PersonPage.propTypes = {
  id: PropTypes.string.isRequired,
  person: PropTypes.object,
  t: PropTypes.func.isRequired,
  setPerson: PropTypes.func.isRequired,
  deletePerson: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  updateLanguage: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};
