import React from "react";
import axios from "axios";

import CheckIconButton from "../shared/CheckIconButton";
import DeleteIconButton from "../shared/DeleteIconButton";
import EditIconButton from "../shared/EditIconButton";
import FuzzyDateInput from "../shared/FuzzyDateInput";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import TextInput from "../shared/TextInput";

import DateCell from "./DateCell";

class Workshop extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      saving: false,
      name: props.workshop.name,
      completed: props.workshop.completed,
      date: props.workshop.date
    };
  }

  editMode = () => {
    this.setState({ editing: true, saving: false });
  };

  cancelEdit = () => {
    this.setState({
      name: this.props.workshop.name,
      completed: this.props.workshop.completed,
      date: this.props.workshop.date,
      editing: false,
      enteringDate: false,
      saving: false
    });
  };

  handleInput = e => {
    this.setState({
      [e.target.name]: e.target.value,
      nameError: null
    });
  };

  handleCheck = e => {
    this.setState({
      [e.target.name]: e.target.checked
    });
  };

  handleDateInput = dateString => {
    this.setState({
      date: dateString,
      invalidDateEntered: false
    });
  };

  dateIsInvalid = () => {
    this.setState({
      invalidDateEntered: true
    });
  };

  delete = () => {
    if (
      confirm(
        this.props
          .t("Delete_workshop_confirmation")
          .replace("%{name}", this.state.name)
      )
    ) {
      this.props.deleteWorkshop(this.props.workshop.id);
    }
  };

  save = () => {
    if (this.validate()) {
      this.updateWorkshop();
    }
  };

  completeWorkshop = () => {
    if (this.props.workshop.date) {
      this.setState({ completed: true }, () => {
        this.updateWorkshop();
      });
    } else {
      this.setState({
        completed: true,
        enteringDate: true
      });
    }
  };

  updateWorkshop = () => {
    this.setState({ saving: true });
    const id = this.props.workshop.id;
    const workshop = {
      name: this.state.name,
      completed: this.state.completed,
      date: this.state.date
    };
    axios
      .put(`/api/workshops/${id}/`, {
        authenticity_token: this.props.authenticity_token,
        workshop: workshop
      })
      .then(response => {
        this.props.handleUpdatedWorkshop(response.data);
        this.setState({
          editing: false,
          enteringDate: false,
          saving: false
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({
          saving: false
        });
      });
  };

  validate = () => {
    if (this.state.invalidDateEntered) {
      this.setState({ showDateErrors: true });
      return false;
    }
    if (!this.state.name) {
      this.setState({ nameError: this.props.t("Name_not_blank") });
      return false;
    }
    return true;
  };

  render() {
    if (this.state.editing) {
      return (
        <tr>
          <td colSpan="4">
            <TextInput
              name="name"
              value={this.state.name}
              handleInput={this.handleInput}
              handleEnter={this.save}
              errorMessage={this.state.nameError}
            />
            {this.props.workshop.completed && (
              <label className="checkBoxLabel">
                <input
                  type="checkbox"
                  name="completed"
                  checked={this.state.completed}
                  onChange={this.handleCheck}
                />
                Completed
              </label>
            )}
            <SmallSaveAndCancel
              handleSave={this.save}
              handleCancel={this.cancelEdit}
              saveInProgress={this.state.saving}
              t={this.props.t}
            />
          </td>
        </tr>
      );
    } else if (this.state.enteringDate) {
      return (
        <tr>
          <td colSpan="4" className="inlineFuzzyDateInputs">
            <label>{this.props.t("Workshop_date")}:</label>
            <br />

            <FuzzyDateInput
              date={this.state.date}
              handleDateInput={this.handleDateInput}
              dateIsInvalid={this.dateIsInvalid}
              showErrors={this.state.showDateErrors}
              strings={this.props.t("date_strings")}
            />

            <SmallSaveAndCancel
              handleSave={this.save}
              handleCancel={this.cancelEdit}
              saveInProgress={this.state.saving}
              t={this.props.t}
            />
          </td>
        </tr>
      );
    } else {
      return (
        <tr>
          <td>{this.state.name}</td>
          <td>
            <DateCell
              date={this.props.workshop.formattedDate}
              eventPath={this.props.workshop.eventPath}
              newEventPath={this.props.workshop.newEventPath}
              canUpdate={this.props.workshop.can.update}
              t={this.props.t}
            />
          </td>
          <td>
            {this.state.completed
              ? this.props.t("Completed")
              : this.props.workshop.can.update && (
                  <CheckIconButton
                    handleClick={this.completeWorkshop}
                    text={this.props.t("Mark_completed")}
                  />
                )}
          </td>
          {this.props.workshop.can.update && (
            <td align="right" style={{ whiteSpace: "noWrap" }}>
              <EditIconButton handleClick={this.editMode} />
              {this.props.displayDelete && (
                <DeleteIconButton handleClick={this.delete} />
              )}
            </td>
          )}
        </tr>
      );
    }
  }
}

export default Workshop;
