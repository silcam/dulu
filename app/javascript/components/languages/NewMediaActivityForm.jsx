import React from "react";
import PropTypes from "prop-types";
import styles from "./ActivitiesTable.css";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import Activity from "../../models/Activity";
import update from "immutability-helper";
import SelectInput from "../shared/SelectInput";
import SaveIndicator from "../shared/SaveIndicator";
import FormGroup from "../shared/FormGroup";

export default class NewMediaActivityForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newActivity: {
        category: Activity.mediaCategories[0],
        scripture: Activity.mediaScriptures[0],
        film: Activity.mediaFilms[0]
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
        <label>{t("New_activity")}</label>
        <FormGroup label={t("Category")}>
          <SelectInput
            value={this.state.newActivity.category}
            setValue={category => this.updateNewActivity({ category })}
            options={SelectInput.translatedOptions(Activity.mediaCategories, t)}
          />
        </FormGroup>
        {this.state.newActivity.category == "AudioScripture" && (
          <FormGroup label={t("Contents")}>
            <SelectInput
              value={this.state.newActivity.scripture}
              setValue={scripture => this.updateNewActivity({ scripture })}
              options={SelectInput.translatedOptions(
                Activity.mediaScriptures,
                t
              )}
            />
          </FormGroup>
        )}
        {this.state.newActivity.category == "Film" && (
          <FormGroup label={t("Film")}>
            <SelectInput
              value={this.state.newActivity.film}
              setValue={film => this.updateNewActivity({ film })}
              options={SelectInput.translatedOptions(
                Activity.mediaFilms,
                t,
                "films"
              )}
            />
          </FormGroup>
        )}
        <SmallSaveAndCancel
          handleSave={() => this.props.addNewActivity(this.state.newActivity)}
          handleCancel={this.props.cancelForm}
          t={t}
        />
      </div>
    );
  }
}

NewMediaActivityForm.propTypes = {
  saving: PropTypes.bool,
  t: PropTypes.func.isRequired,
  cancelForm: PropTypes.func.isRequired,
  addNewActivity: PropTypes.func.isRequired
};
