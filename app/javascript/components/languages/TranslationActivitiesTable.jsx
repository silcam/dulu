import React from "react";
import PropTypes from "prop-types";
import TranslationActivityRow from "./TranslationActivityRow";
import update from "immutability-helper";
import { findIndexById } from "../../util/findById";
import InlineAddIcon from "../shared/icons/InlineAddIcon";
import { SelectGroup, FuzzyDateGroup } from "../shared/formGroup";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import FuzzyDate from "../../util/FuzzyDate";
import Activity from "../../models/Activity";
import DuluAxios from "../../util/DuluAxios";

export default class TranslationActivitiesTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this.freshState(props);
  }

  freshState = props => {
    const availableBooks = Activity.availableBooks(
      props.language.translation_activities,
      props.t
    );
    return {
      newActivity: {
        language_id: props.language.id,
        bible_book_id: availableBooks[0] && availableBooks[0].id
      },
      bookOptions: availableBooks.map(book => ({
        value: book.id,
        display: book.name
      })),
      showNewForm: false
    };
  };

  addNewActivity = async () => {
    const data = await DuluAxios.post(
      `/api/programs/${this.props.language.id}/translation_activities/`,
      {
        translation_activity: this.state.newActivity
      }
    );
    this.props.replaceLanguage(
      update(this.props.language, {
        translation_activities: { $set: data.translation_activities }
      })
    );
    this.setState(this.freshState(this.props));
  };

  replaceTranslationActivity = newActivity => {
    this.props.replaceLanguage(
      update(this.props.language, {
        translation_activities: {
          [findIndexById(
            this.props.language.translation_activities,
            newActivity.id
          )]: { $set: newActivity }
        }
      })
    );
  };

  updateNewActivity = mergeActivity => {
    this.setState(prevState => ({
      newActivity: update(prevState.newActivity, { $merge: mergeActivity })
    }));
  };

  render() {
    const language = this.props.language;
    const t = this.props.t;
    return (
      <div>
        <h3>
          {t("Activities")}
          {!this.state.showNewForm && this.state.bookOptions.length > 0 && (
            <InlineAddIcon
              onClick={() => this.setState({ showNewForm: true })}
            />
          )}
        </h3>
        {this.state.showNewForm && (
          <div>
            <SelectGroup
              label={t("Book")}
              value={this.state.newActivity.bible_book_id}
              handleChange={e =>
                this.updateNewActivity({ bible_book_id: e.target.value })
              }
              options={this.state.bookOptions}
              autoFocus
            />
            <SmallSaveAndCancel
              t={t}
              handleSave={this.addNewActivity}
              handleCancel={() => this.setState({ showNewForm: false })}
              saveDisabled={this.state.newActivity.invalidDate}
            />
          </div>
        )}
        <table>
          <tbody>
            {language.translation_activities.map(activity => (
              <TranslationActivityRow
                key={activity.id}
                activity={activity}
                t={t}
                replaceActivity={this.replaceTranslationActivity}
                setNetworkError={this.props.setNetworkError}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

TranslationActivitiesTable.propTypes = {
  language: PropTypes.object.isRequired,
  replaceLanguage: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired
};
