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
import BooksSelector from "./BooksSelector";
import P from "../shared/P";

interface IProps {
  saving?: boolean;
  cancelForm: () => void;
  addNewActivity: (a: NewMediaActivity) => void;
}

interface NewMediaActivity {
  category: MediaCategory;
  scripture: MediaScripture;
  film: MediaFilm;
  bible_book_ids: number[];
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
        film: Activity.mediaFilms[0],
        bible_book_ids: []
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
            {this.state.newActivity.category == "AudioScripture" &&
              this.state.newActivity.scripture == "Other" && (
                <P>
                  <label>{t("Books")}</label>
                  <BooksSelector
                    bookIds={this.state.newActivity.bible_book_ids}
                    setBookIds={bible_book_ids =>
                      this.updateNewActivity({ bible_book_ids })
                    }
                  />
                </P>
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
                    undefined,
                    false
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
