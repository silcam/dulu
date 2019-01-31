import React from "react";
import PropTypes from "prop-types";
import styles from "./ActivitiesTable.css";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import { TextInputGroup } from "../shared/formGroup";
import update from "immutability-helper";
import SaveIndicator from "../shared/SaveIndicator";
import TextInput from "../shared/TextInput";
import AddIcon from "../shared/icons/AddIcon";

export default class NewWorkshopsActivityForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newActivity: {
        title: "",
        workshops_attributes: [{ number: 1, name: "" }]
      }
    };
  }

  updateNewActivity = mergeActivity => {
    this.setState(prevState => ({
      newActivity: update(prevState.newActivity, { $merge: mergeActivity })
    }));
  };

  addWorkshop = () => {
    this.setState(prevState => {
      const newNumber = prevState.newActivity.workshops_attributes.length + 1;
      return {
        newActivity: update(prevState.newActivity, {
          workshops_attributes: { $push: [{ number: newNumber, name: "" }] }
        })
      };
    });
  };

  updateWorkshop = workshop => {
    this.setState(prevState => {
      const wsIndex = workshop.number - 1;
      return {
        newActivity: update(prevState.newActivity, {
          workshops_attributes: { [wsIndex]: { $set: workshop } }
        })
      };
    });
  };

  render() {
    const t = this.props.t;
    if (this.props.saving) return <SaveIndicator saving={true} t={t} />;

    return (
      <div className={styles.newActivityForm}>
        <TextInputGroup
          label={t("New_activity")}
          placeholder={t("Title")}
          value={this.state.newActivity.title}
          handleInput={e => this.updateNewActivity({ title: e.target.value })}
          autoFocus
        />
        <label>{t("Workshops")}</label>
        <table className={styles.workshopsTable}>
          <tbody>
            {this.state.newActivity.workshops_attributes.map(workshop => (
              <tr key={workshop.number}>
                <td>{workshop.number + ":"}</td>
                <td style={{ width: "100%" }}>
                  <TextInput
                    placeholder={t("Name")}
                    value={workshop.name}
                    handleInput={e =>
                      this.updateWorkshop({
                        number: workshop.number,
                        name: e.target.value
                      })
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <AddIcon onClick={this.addWorkshop} />
        <SmallSaveAndCancel
          handleSave={() => this.props.addNewActivity(this.state.newActivity)}
          handleCancel={this.props.cancelForm}
          t={t}
        />
      </div>
    );
  }
}

NewWorkshopsActivityForm.propTypes = {
  saving: PropTypes.bool,
  t: PropTypes.func.isRequired,
  cancelForm: PropTypes.func.isRequired,
  addNewActivity: PropTypes.func.isRequired
};