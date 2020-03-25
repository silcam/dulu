import React from "react";
import DuluAxios from "../../util/DuluAxios";
import DeleteIcon from "../shared/icons/DeleteIcon";
import EditIcon from "../shared/icons/EditIcon";
import FuzzyDateInput from "../shared/FuzzyDateInput";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import TextInput from "../shared/TextInput";

import DateCell from "./DateCell";
import { IWorkshop } from "../../models/Workshop";
import { T } from "../../i18n/i18n";
import { ICan } from "../../actions/canActions";
import { ILanguage } from "../../models/Language";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  workshop: IWorkshop;
  can: ICan;
  displayDelete?: boolean;
  handleUpdatedWorkshop: (ws: IWorkshop) => void;
  deleteWorkshop: (id: number) => void;
  language: ILanguage;
}

interface IState {
  editing: boolean;
  saving: boolean;
  name: string;
  completed: boolean;
  date?: string;
  enteringDate?: boolean;
  invalidDateEntered?: boolean;
  showDateErrors?: boolean;
  nameError?: string | null;
}

export default class Workshop extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
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

  setName = (name: string) => {
    this.setState({
      name,
      nameError: null
    });
  };

  handleDateInput = (dateString: string) => {
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

  delete = (t: T) => {
    if (
      confirm(
        t("Delete_workshop_confirmation").replace("%{name}", this.state.name)
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
      this.props.handleUpdatedWorkshop(data as IWorkshop);
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
      this.setState({ nameError: "Name_not_blank" });
      return false;
    }
    return true;
  };

  render() {
    if (this.state.editing) {
      return (
        <I18nContext.Consumer>
          {t => (
            <tr>
              <td colSpan={4}>
                <TextInput
                  name="name"
                  value={this.state.name}
                  setValue={this.setName}
                  handleEnter={this.save}
                  errorMessage={
                    this.state.nameError ? t(this.state.nameError) : null
                  }
                />
                {this.props.workshop.completed && (
                  <label className="checkBoxLabel">
                    <input
                      type="checkbox"
                      name="completed"
                      checked={this.state.completed}
                      onChange={e =>
                        this.setState({ completed: e.target.checked })
                      }
                    />
                    {t("Completed")}
                  </label>
                )}
                <SmallSaveAndCancel
                  handleSave={this.save}
                  handleCancel={this.cancelEdit}
                  saveInProgress={this.state.saving}
                />
              </td>
            </tr>
          )}
        </I18nContext.Consumer>
      );
    } else if (this.state.enteringDate) {
      return (
        <I18nContext.Consumer>
          {t => (
            <tr>
              <td colSpan={4} className="inlineFuzzyDateInputs">
                <label>{t("Workshop_date")}:</label>
                <br />

                <FuzzyDateInput
                  date={this.state.date}
                  handleDateInput={this.handleDateInput}
                  dateIsInvalid={this.dateIsInvalid}
                  showErrors={this.state.showDateErrors}
                />

                <SmallSaveAndCancel
                  handleSave={this.save}
                  handleCancel={this.cancelEdit}
                  saveInProgress={this.state.saving}
                />
              </td>
            </tr>
          )}
        </I18nContext.Consumer>
      );
    } else {
      return (
        <I18nContext.Consumer>
          {t => (
            <tr>
              <td>{this.state.name}</td>
              <td>
                <DateCell
                  workshop={this.props.workshop}
                  language={this.props.language}
                  canUpdate={this.props.can.update}
                />
              </td>
              <td>
                {this.props.workshop.completed
                  ? t("Completed")
                  : this.props.can.update && (
                      <button onClick={this.completeWorkshop}>
                        {t("Completed")}
                      </button>
                    )}
              </td>
              {this.props.can.update && (
                <td align="right" style={{ whiteSpace: "nowrap" }}>
                  <EditIcon onClick={this.editMode} />
                  {this.props.displayDelete && (
                    <DeleteIcon onClick={() => this.delete(t)} />
                  )}
                </td>
              )}
            </tr>
          )}
        </I18nContext.Consumer>
      );
    }
  }
}
