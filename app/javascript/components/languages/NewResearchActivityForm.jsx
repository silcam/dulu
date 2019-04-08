import React from "react";
import PropTypes from "prop-types";
import styles from "./ActivitiesTable.css";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import { SelectGroup, TextInputGroup } from "../shared/formGroup";
import Activity from "../../models/Activity";
import update from "immutability-helper";
import SelectInput from "../shared/SelectInput";
import SaveIndicator from "../shared/SaveIndicator";

export default class NewResearchActivityForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newActivity: {
        title: ""
      }
    };
  }

  updateNewActivity = mergeActivity => {
    this.setState(prevState => ({
      newActivity: update(prevState.newActivity, { $merge: mergeActivity })
    }));
  };

  render() {
    const t = this.props.t;
    if (this.props.saving) return <SaveIndicator saving={true} t={t} />;

    return (
      <div className={styles.newActivityForm}>
        <TextInputGroup
          label={t("New_activity")}
          value={this.state.newActivity.title}
          placeholder={t("Title")}
          setValue={title => this.updateNewActivity({ title })}
          autoFocus
        />
        <SmallSaveAndCancel
          handleSave={() => this.props.addNewActivity(this.state.newActivity)}
          handleCancel={this.props.cancelForm}
          t={t}
          saveDisabled={this.state.newActivity.title == ""}
        />
      </div>
    );
  }
}

NewResearchActivityForm.propTypes = {
  saving: PropTypes.bool,
  t: PropTypes.func.isRequired,
  cancelForm: PropTypes.func.isRequired,
  addNewActivity: PropTypes.func.isRequired
};
