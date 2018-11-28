import React from "react";
import PropTypes from "prop-types";
import ActivityRow from "./ActivityRow";
import update from "immutability-helper";
import { findIndexById } from "../../util/findById";
import InlineAddIcon from "../shared/icons/InlineAddIcon";
import Activity from "../../models/Activity";
import DuluAxios from "../../util/DuluAxios";
import NewMediaActivityForm from "./NewMediaActivityForm";
import NewTranslationActivityForm from "./NewTranslationActivityForm";
import styles from "./ActivitiesTable.css";
import NewResearchActivityForm from "./NewResearchActivityForm";
import NewWorkshopsActivityForm from "./NewWorkshopsActivityForm";

export default class ActivitiesTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this.freshState(props);
  }

  freshState = () => {
    return {
      showNewForm: false,
      newFormSaving: false
    };
  };

  x_activity = () => `${this.props.type}_activity`;

  x_activities = () => `${this.props.type}_activities`;

  NewActivityForm = () => {
    switch (this.props.type) {
      case "media":
        return NewMediaActivityForm;
      case "research":
        return NewResearchActivityForm;
      case "translation":
        return NewTranslationActivityForm;
      case "workshops":
        return NewWorkshopsActivityForm;
    }
  };

  addNewActivity = async activity => {
    this.setState({ newFormSaving: true });
    try {
      const data = await DuluAxios.post(
        `/api/programs/${this.props.language.id}/${this.x_activities()}/`,
        {
          [this.x_activity()]: activity
        }
      );
      this.props.replaceLanguage(
        update(this.props.language, {
          [this.x_activities()]: { $set: data[this.x_activities()] }
        })
      );
      this.setState(this.freshState(this.props));
    } catch (error) {
      this.props.setNetworkError({});
      this.setState({ newFormSaving: false });
    }
  };

  replaceActivity = newActivity => {
    this.props.replaceLanguage(
      update(this.props.language, {
        [this.x_activities()]: {
          [findIndexById(
            this.props.language[this.x_activities()],
            newActivity.id
          )]: {
            $set: newActivity
          }
        }
      })
    );
  };

  render() {
    const language = this.props.language;
    const t = this.props.t;
    const NewActivityForm = this.NewActivityForm();
    return (
      <div>
        <h3>
          {this.props.heading || t("Activities")}
          {!this.state.showNewForm && this.props.language.can.update && (
            <InlineAddIcon
              onClick={() => this.setState({ showNewForm: true })}
            />
          )}
        </h3>
        {this.state.showNewForm && (
          <NewActivityForm
            t={t}
            saving={this.state.newFormSaving}
            cancelForm={() => this.setState({ showNewForm: false })}
            addNewActivity={this.addNewActivity}
            availableBooks={
              this.props.type == "translation" &&
              Activity.availableBooks(
                this.props.language.translation_activities,
                t
              )
            }
          />
        )}
        <table>
          <tbody>
            {language[this.x_activities()].map(activity => (
              <ActivityRow
                key={activity.id}
                activity={activity}
                can={this.props.language.can}
                t={t}
                replaceActivity={this.replaceActivity}
                setNetworkError={this.props.setNetworkError}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

ActivitiesTable.propTypes = {
  type: PropTypes.oneOf(["media", "research", "translation", "workshops"])
    .isRequired,
  language: PropTypes.object.isRequired,
  replaceLanguage: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  heading: PropTypes.string // Default "Activities"
};
