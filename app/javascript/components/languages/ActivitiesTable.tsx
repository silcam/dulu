import React from "react";
import ActivityRow from "./ActivityRow";
import InlineAddIcon from "../shared/icons/InlineAddIcon";
import Activity, { IActivity, ActivityType } from "../../models/Activity";
import DuluAxios from "../../util/DuluAxios";
import NewMediaActivityForm from "./NewMediaActivityForm";
import NewTranslationActivityForm from "./NewTranslationActivityForm";
// import styles from "./ActivitiesTable.css";
import NewResearchActivityForm from "./NewResearchActivityForm";
import NewWorkshopsActivityForm from "./NewWorkshopsActivityForm";
import { Adder, Setter, PSetter } from "../../models/TypeBucket";
import { ILanguage } from "../../models/Language";
import I18nContext from "../../contexts/I18nContext";
import List from "../../models/List";

interface IProps {
  activities: List<IActivity>;
  addActivities: Adder<IActivity>;
  setActivity: PSetter<IActivity>;
  setLanguage: Setter<ILanguage>;
  type: ActivityType;
  language: ILanguage;

  heading?: string; // Default "Activities"
  basePath: string;
}

interface IState {
  showNewForm: boolean;
  newFormSaving: boolean;
}

export default class ActivitiesTable extends React.PureComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = this.freshState();
  }

  async componentDidMount() {
    const data = await DuluAxios.get(`/api/activities`, {
      language_id: this.props.language.id
    });
    if (data) {
      this.props.addActivities(data.translation_activities);
      this.props.addActivities(data.media_activities);
      this.props.addActivities(data.research_activities);
      this.props.addActivities(data.workshops_activities);
      this.props.setLanguage(data.language);
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

  addNewActivity = async (activity: Partial<IActivity>) => {
    this.setState({ newFormSaving: true });
    const data = await DuluAxios.post(
      `/api/languages/${this.props.language.id}/${this.x_activities()}/`,
      {
        [this.x_activity()]: activity
      }
    );
    if (data) {
      this.props.setActivity(data.activity);
      this.setState(this.freshState());
    } else {
      this.setState({ newFormSaving: false });
    }
  };

  render() {
    const NewActivityForm = this.NewActivityForm();
    return (
      <I18nContext.Consumer>
        {t => (
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
                saving={this.state.newFormSaving}
                cancelForm={() => this.setState({ showNewForm: false })}
                addNewActivity={this.addNewActivity}
                availableBooks={
                  this.props.type == "Translation"
                    ? Activity.availableBooks(this.props.activities, t)
                    : []
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
                    basePath={this.props.basePath}
                    setActivity={this.props.setActivity}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </I18nContext.Consumer>
    );
  }
}
