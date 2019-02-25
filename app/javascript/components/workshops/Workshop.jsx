import React from "react";
import DuluAxios from "../../util/DuluAxios";
import PropTypes from "prop-types";
import DeleteIcon from "../shared/icons/DeleteIcon";
import EditIcon from "../shared/icons/EditIcon";
import FuzzyDateInput from "../shared/FuzzyDateInput";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import TextInput from "../shared/TextInput";

import DateCell from "./DateCell";

export default class Workshop extends React.PureComponent {
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

  updateWorkshop = async () => {
    this.setState({ saving: true });
    const id = this.props.workshop.id;
    const workshop = {
      name: this.state.name,
      completed: this.state.completed,
      date: this.state.date
    };
    const data = await DuluAxios.put(`/api/workshops/${id}/`, {
      workshop: workshop
    });
    if (data) {
      this.props.handleUpdatedWorkshop(data);
      this.setState({
        editing: false,
        enteringDate: false,
        saving: false
      });
    } else {
      this.setState({ saving: false });
    }
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
                {this.props.t("Completed")}
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
              t={this.props.t}
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
              workshop={this.props.workshop}
              language={this.props.language}
              canUpdate={this.props.can.update}
              t={this.props.t}
            />
          </td>
          <td>
            {this.state.completed
              ? this.props.t("Completed")
              : this.props.can.update && (
                  <button onClick={this.completeWorkshop}>
                    {this.props.t("Completed")}
                  </button>
                )}
          </td>
          {this.props.can.update && (
            <td align="right" style={{ whiteSpace: "noWrap" }}>
              <EditIcon onClick={this.editMode} />
              {this.props.displayDelete && <DeleteIcon onClick={this.delete} />}
            </td>
          )}
        </tr>
      );
    }
  }
}

Workshop.propTypes = {
  workshop: PropTypes.object.isRequired,
  can: PropTypes.object.isRequired,
  displayDelete: PropTypes.bool,

  handleUpdatedWorkshop: PropTypes.func.isRequired,
  deleteWorkshop: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  language: PropTypes.object.isRequired
};
