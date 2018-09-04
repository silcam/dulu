import React from "react";

import tSub from "../../util/tSub";

import CloseIconButton from "../../shared_components/CloseIconButton";
import DangerButton from "../../shared_components/DangerButton";
import DeleteIconButton from "../../shared_components/DeleteIconButton";
import EditableTextBox from "../../shared_components/EditableTextBox";
import backedModel from "../../shared_components/backedModel";
import SaveIndicator from "../../shared_components/SaveIndicator";

import EventsTable from "./EventsTable";
import ParticipantsTable from "./ParticipantsTable";
import PersonBasicInfo from "./PersonBasicInfo";
import OrgPeopleTable from "./OrgPeopleTable";
import RolesTable from "./RolesTable";
import ErrorMessage from "../../shared_components/ErrorMessage";
import differentIds from "../../util/differentIds";

class BasicPersonContent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      deleting: false,
      errorMessage: ""
    };
  }

  componentDidUpdate(prevProps) {
    if (differentIds(prevProps.person, this.props.person)) {
      this.setState({
        deleting: false,
        errorMessage: ""
      });
    }
  }

  setErrorMessage = errorMessage => {
    this.setState({ errorMessage: errorMessage });
  };

  clickClose = () => {
    this.props.setSelection(null);
  };

  clickDelete = () => {
    this.setState({
      deleting: true
    });
  };

  cancelDelete = () => {
    this.setState({
      deleting: false
    });
  };

  deletePerson = () => {
    const personId = this.props.person.id;
    this.props.delete(() => {
      this.props.deletePerson(personId);
    });
  };

  updateField = (field, value, callback) => {
    this.props.update({ [field]: value }, callback);
  };

  // Correct capitalization of names
  // updateNameField = (field, value) => {
  //     let v = fixCaps(value)
  //     this.updateField(field, v)
  // }

  render() {
    const strings = this.props.strings;
    const person = this.props.person;

    if (person == null) {
      return <p className="alertBox alertYellow">{strings.Loading}</p>;
    }

    const editEnabled = this.props.can.update;
    const fullName = `${person.first_name} ${person.last_name}`;
    const deleteWarning = tSub(strings.delete_person_warning, {
      name: fullName
    });
    const deleteButtonText = tSub(strings.delete_person, { name: fullName });

    return (
      <div>
        <h3 style={{ color: "#aaa" }}>
          <CloseIconButton handleClick={this.clickClose} />
          {this.props.can.destroy && (
            <DeleteIconButton handleClick={this.clickDelete} />
          )}
        </h3>

        {this.state.deleting && (
          <DangerButton
            handleClick={this.deletePerson}
            handleCancel={this.cancelDelete}
            message={deleteWarning}
            buttonText={deleteButtonText}
            strings={strings}
          />
        )}

        <SaveIndicator
          strings={strings}
          saving={this.props.saving > 0}
          saved={this.props.savedChanges}
        />

        <ErrorMessage message={this.state.errorMessage} />

        <h2>
          <EditableTextBox
            field="first_name"
            text={person.first_name}
            value={person.first_name}
            updateValue={this.updateField}
            editEnabled={editEnabled}
            validateNotBlank={true}
            strings={strings}
          />
          &nbsp;
          <EditableTextBox
            field="last_name"
            text={person.last_name}
            value={person.last_name}
            updateValue={this.updateField}
            editEnabled={editEnabled}
            validateNotBlank={true}
            strings={strings}
          />
        </h2>

        <PersonBasicInfo
          strings={strings}
          person={person}
          updateField={this.updateField}
          editEnabled={editEnabled}
          setErrorMessage={this.setErrorMessage}
        />

        <OrgPeopleTable
          strings={strings}
          person={person}
          editEnabled={editEnabled}
          rawPost={this.props.rawPost}
          rawPut={this.props.rawPut}
          rawDelete={this.props.rawDelete}
          updateModel={this.props.updateModel}
          setOrg={this.props.setOrg}
        />

        <RolesTable
          person={person}
          strings={strings}
          editEnabled={editEnabled}
          rawPost={this.props.rawPost}
        />

        <ParticipantsTable person={person} strings={strings} />

        <EventsTable person={person} strings={strings} />
      </div>
    );
  }
}

const PersonContent = backedModel(BasicPersonContent, "/api/people", "person");

export default PersonContent;
