import React from "react";
import PropTypes from "prop-types";
import styles from "./ActivitiesTable.css";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import update from "immutability-helper";
import SaveIndicator from "../shared/SaveIndicator";
import FormGroup from "../shared/FormGroup";
import TextInput from "../shared/TextInput";

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
        <FormGroup label={t("New_activity")}>
          <TextInput
            value={this.state.newActivity.title}
            placeholder={t("Title")}
            setValue={title => this.updateNewActivity({ title })}
            autoFocus
          />
        </FormGroup>
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
