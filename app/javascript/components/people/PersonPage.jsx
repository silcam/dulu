import React from "react";
import EditActionBar from "../shared/EditActionBar";
import deepcopy from "../../util/deepcopy";
import TextOrEditText from "../shared/TextOrEditText";
import merge from "deepmerge";
import SaveIndicator from "../shared/SaveIndicator";
import PersonBasicInfo from "./PersonBasicInfo";
import DangerButton from "../shared/DangerButton";
import { fullName } from "../../models/person";
import MyOrganizationsTable from "./MyOrganizationsTable";
import update from "immutability-helper";
import ParticipantsTable from "./ParticipantsTable";
import EventsTable from "./EventsTable";
import DuluAxios from "../../util/DuluAxios";

export default class PersonPage extends React.PureComponent {
  state = {
    person: deepcopy(this.props.person)
  };

  updatePerson = mergePerson => {
    this.setState(prevState => ({
      edited: true,
      person: merge(prevState.person, mergePerson)
    }));
  };

  save = async () => {
    try {
      const data = await DuluAxios.put(`/api/people/${this.state.person.id}`, {
        person: this.state.person
      });
      this.props.replacePerson(data.person);
      this.setStateAfterSave(data.person);
    } catch (error) {
      this.props.setNetworkError({ tryAgain: this.save });
    }
  };

  setStateAfterSave = person => {
    this.setState({
      editing: false,
      edited: false,
      saving: false,
      savedChanges: true,
      person: person
    });
  };

  replaceOrganizationPeople = newOrganizationsPeople => {
    const newPerson = update(this.props.person, {
      organization_people: { $set: newOrganizationsPeople }
    });
    this.setState({
      person: deepcopy(newPerson)
    });
    this.props.replacePerson(newPerson);
  };

  render() {
    const person = this.state.person;

    return (
      <div>
        <EditActionBar
          can={person.can}
          editing={this.state.editing}
          saveDisabled={!this.state.edited}
          t={this.props.t}
          edit={() => this.setState({ editing: true })}
          delete={() => this.setState({ deleting: true })}
          save={this.save}
          cancel={() =>
            this.setState({
              editing: false,
              edited: false,
              person: deepcopy(this.props.person)
            })
          }
        />

        {this.state.deleting && (
          <DangerButton
            handleClick={() => {
              this.props.deletePerson(person.id);
            }}
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
            value={person.first_name}
            updateValue={value => this.updatePerson({ first_name: value })}
          />
          &nbsp;
          <TextOrEditText
            editing={this.state.editing}
            value={person.last_name}
            updateValue={value => this.updatePerson({ last_name: value })}
          />
        </h2>

        <PersonBasicInfo
          t={this.props.t}
          person={person}
          editing={this.state.editing}
          updatePerson={this.updatePerson}
        />

        <MyOrganizationsTable
          t={this.props.t}
          person={person}
          replaceOrganizationPeople={this.replaceOrganizationPeople}
          setNetworkError={this.props.setNetworkError}
        />

        <ParticipantsTable t={this.props.t} person={person} />

        <EventsTable t={this.props.t} person={person} />
      </div>
    );
  }
}
