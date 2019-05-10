import React from "react";
import styles from "./ActivitiesTable.css";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import update from "immutability-helper";
import SaveIndicator from "../shared/SaveIndicator";
import FormGroup from "../shared/FormGroup";
import SelectInput from "../shared/SelectInput";
import { IBibleBook } from "../../models/BibleBook";
import I18nContext from "../../contexts/I18nContext";

interface NewTranslationActivity {
  bible_book_id: number;
}

interface IProps {
  availableBooks: IBibleBook[];
  saving?: boolean;
  cancelForm: () => void;
  addNewActivity: (a: NewTranslationActivity) => void;
}

interface IState {
  newActivity: NewTranslationActivity;
}

export default class NewTranslationActivityForm extends React.PureComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      newActivity: {
        bible_book_id: props.availableBooks[0] && props.availableBooks[0].id
      }
    };
  }

  updateNewActivity = (mergeActivity: Partial<NewTranslationActivity>) => {
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
            <FormGroup label={t("New_activity")}>
              <SelectInput
                value={`${this.state.newActivity.bible_book_id}`}
                setValue={id =>
                  this.updateNewActivity({ bible_book_id: parseInt(id) })
                }
                options={this.props.availableBooks.map(book => ({
                  value: `${book.id}`,
                  display: book.name
                }))}
              />
            </FormGroup>
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
