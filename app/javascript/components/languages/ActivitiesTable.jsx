import React from "react";
import PropTypes from "prop-types";
import ActivityRow from "./ActivityRow";
import InlineAddIcon from "../shared/icons/InlineAddIcon";
import Activity from "../../models/Activity";
import DuluAxios from "../../util/DuluAxios";
import NewMediaActivityForm from "./NewMediaActivityForm";
import NewTranslationActivityForm from "./NewTranslationActivityForm";
// import styles from "./ActivitiesTable.css";
import NewResearchActivityForm from "./NewResearchActivityForm";
import NewWorkshopsActivityForm from "./NewWorkshopsActivityForm";

export default class ActivitiesTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this.freshState(props);
  }

  async componentDidMount() {
    try {
      const data = await DuluAxios.get(`/api/activities`, {
        language_id: this.props.language.id
      });
      this.props.addActivities(data.translation_activities);
      this.props.addActivities(data.media_activities);
      this.props.addActivities(data.research_activities);
      this.props.addActivities(data.workshops_activities);
      this.props.setLanguage(data.language);
    } catch (error) {
      this.props.setNetworkError(error);
    }
  }

  freshState = () => {
    return {
      showNewForm: false,
      newFormSaving: false
    };
  };

  x_activity = () => `${this.props.type.toLowerCase()}_activity`;

  x_activities = () => `${this.props.type.toLowerCase()}_activities`;

  NewActivityForm = () => {
    switch (this.props.type) {
      case "Media":
        return NewMediaActivityForm;
      case "Research":
        return NewResearchActivityForm;
      case "Translation":
        return NewTranslationActivityForm;
      case "Workshops":
        return NewWorkshopsActivityForm;
    }
  };

  addNewActivity = async activity => {
    this.setState({ newFormSaving: true });
    try {
      const data = await DuluAxios.post(
        `/api/languages/${this.props.language.id}/${this.x_activities()}/`,
        {
          [this.x_activity()]: activity
        }
      );
      this.props.setActivity(data.activity);
      this.setState(this.freshState(this.props));
    } catch (error) {
      this.props.setNetworkError(error);
      this.setState({ newFormSaving: false });
    }
  };

  render() {
    const t = this.props.t;
    const NewActivityForm = this.NewActivityForm();
    return (
      <div>
        <h3>
          {this.props.heading || t("Activities")}
          {!this.state.showNewForm &&
            this.props.language.can.update_activities && (
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
              this.props.type == "Translation" &&
              Activity.availableBooks(this.props.activities, t)
            }
          />
        )}
        <table>
          <tbody>
            {this.props.activities.map(activity => (
              <ActivityRow
                key={activity.id}
                activity={activity}
                can={this.props.language.can}
                t={t}
                replaceActivity={this.replaceActivity}
                setNetworkError={this.props.setNetworkError}
                basePath={this.props.basePath}
                setActivity={this.props.setActivity}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

ActivitiesTable.propTypes = {
  activities: PropTypes.array.isRequired,
  addActivities: PropTypes.func.isRequired,
  setActivity: PropTypes.func.isRequired,
  setLanguage: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["Media", "Research", "Translation", "Workshops"])
    .isRequired,
  language: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  heading: PropTypes.string, // Default "Activities"
  basePath: PropTypes.string.isRequired
};
