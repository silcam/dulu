import React from "react";
import styles from "./ActivitiesTable.css";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import Activity, {
  MediaCategory,
  MediaScripture,
  MediaFilm
} from "../../models/Activity";
import update from "immutability-helper";
import SelectInput from "../shared/SelectInput";
import SaveIndicator from "../shared/SaveIndicator";
import FormGroup from "../shared/FormGroup";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  saving?: boolean;
  cancelForm: () => void;
  addNewActivity: (a: NewMediaActivity) => void;
}

interface NewMediaActivity {
  category: MediaCategory;
  scripture: MediaScripture;
  film: MediaFilm;
}

interface IState {
  newActivity: NewMediaActivity;
}

export default class NewMediaActivityForm extends React.PureComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      newActivity: {
        category: Activity.mediaCategories[0],
        scripture: Activity.mediaScriptures[0],
        film: Activity.mediaFilms[0]
      }
    };
  }

  updateNewActivity = (mergeActivity: Partial<NewMediaActivity>) => {
    this.setState(prevState => ({
      newActivity: update(prevState.newActivity, { $merge: mergeActivity })
    }));
  };

  render() {
    if (this.props.saving) return <SaveIndicator saving={true} />;

    return (
      <I18nContext.Consumer>
        {t => (
          <div className={styles.newActivityForm}>
            <label>{t("New_activity")}</label>
            <FormGroup label={t("Category")}>
              <SelectInput
                value={this.state.newActivity.category}
                setValue={category =>
                  this.updateNewActivity({
                    category: category as MediaCategory
                  })
                }
                options={SelectInput.translatedOptions(
                  Activity.mediaCategories,
                  t
                )}
              />
            </FormGroup>
            {this.state.newActivity.category == "AudioScripture" && (
              <FormGroup label={t("Contents")}>
                <SelectInput
                  value={this.state.newActivity.scripture}
                  setValue={scripture =>
                    this.updateNewActivity({
                      scripture: scripture as MediaScripture
                    })
                  }
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
                  setValue={film =>
                    this.updateNewActivity({ film: film as MediaFilm })
                  }
                  options={SelectInput.translatedOptions(
                    Activity.mediaFilms,
                    t,
                    "films"
                  )}
                />
              </FormGroup>
            )}
            <SmallSaveAndCancel
              handleSave={() =>
                this.props.addNewActivity(this.state.newActivity)
              }
              handleCancel={this.props.cancelForm}
            />
          </div>
        )}
      </I18nContext.Consumer>
    );
  }
}
