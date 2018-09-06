import React from "react";

import tSub from "../../util/tSub";

import CloseIconButton from "../shared/CloseIconButton";
import DangerButton from "../shared/DangerButton";
import DeleteIconButton from "../shared/DeleteIconButton";
import EditableTextBox from "../shared/EditableTextBox";
import backedModel from "../shared/backedModel";
import SaveIndicator from "../shared/SaveIndicator";

import EventsTable from "./EventsTable";
import ParticipantsTable from "./ParticipantsTable";
import PersonBasicInfo from "./PersonBasicInfo";
import OrgPeopleTable from "./OrgPeopleTable";
import RolesTable from "./RolesTable";
import ErrorMessage from "../shared/ErrorMessage";
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
    const t = this.props.t;
    const person = this.props.person;

    if (person == null) {
      return <p className="alertBox alertYellow">{t("Loading")}</p>;
    }

    const editEnabled = this.props.can.update;
    const fullName = `${person.first_name} ${person.last_name}`;
    const deleteWarning = tSub(t("delete_person_warning"), {
      name: fullName
    });
    const deleteButtonText = tSub(t("delete_person"), { name: fullName });

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
            t={t}
          />
        )}

        <SaveIndicator
          t={t}
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
            t={t}
          />
          &nbsp;
          <EditableTextBox
            field="last_name"
            text={person.last_name}
            value={person.last_name}
            updateValue={this.updateField}
            editEnabled={editEnabled}
            validateNotBlank={true}
            t={t}
          />
        </h2>

        <PersonBasicInfo
          t={t}
          person={person}
          updateField={this.updateField}
          editEnabled={editEnabled}
          setErrorMessage={this.setErrorMessage}
        />

        <OrgPeopleTable
          t={t}
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
          t={t}
          editEnabled={editEnabled}
          rawPost={this.props.rawPost}
        />

        <ParticipantsTable person={person} t={t} />

        <EventsTable person={person} t={t} />
      </div>
    );
  }
}

const PersonContent = backedModel(BasicPersonContent, "/api/people", "person");

export default PersonContent;
