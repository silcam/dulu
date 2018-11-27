import React from "react";
import PropTypes from "prop-types";
import styles from "./ActivitiesTable.css";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import { SelectGroup } from "../shared/formGroup";
import Activity from "../../models/Activity";
import update from "immutability-helper";
import SelectInput from "../shared/SelectInput";
import SaveIndicator from "../shared/SaveIndicator";

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
        <SelectGroup
          label={t("Category")}
          value={this.state.newActivity.category}
          handleChange={e =>
            this.updateNewActivity({ category: e.target.value })
          }
          options={SelectInput.translatedOptions(Activity.mediaCategories, t)}
        />
        {this.state.newActivity.category == "AudioScripture" && (
          <SelectGroup
            label={t("Contents")}
            value={this.state.newActivity.scripture}
            handleChange={e =>
              this.updateNewActivity({ scripture: e.target.value })
            }
            options={SelectInput.translatedOptions(Activity.mediaScriptures, t)}
          />
        )}
        {this.state.newActivity.category == "Film" && (
          <SelectGroup
            label={t("Film")}
            value={this.state.newActivity.film}
            handleChange={e => this.updateNewActivity({ film: e.target.value })}
            options={SelectInput.translatedOptions(
              Activity.mediaFilms,
              t,
              "films"
            )}
          />
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
