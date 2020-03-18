import React from "react";
import ActivityRow from "./ActivityRow";
import InlineAddIcon from "../shared/icons/InlineAddIcon";
import Activity, { IActivity, ActivityType } from "../../models/Activity";
import NewMediaActivityForm from "./NewMediaActivityForm";
import NewTranslationActivityForm from "./NewTranslationActivityForm";
// import styles from "./ActivitiesTable.css";
import NewResearchActivityForm from "./NewResearchActivityForm";
import NewWorkshopsActivityForm from "./NewWorkshopsActivityForm";
import { ILanguage } from "../../models/Language";
import I18nContext from "../../contexts/I18nContext";
import List from "../../models/List";
import StyledTable from "../shared/StyledTable";
import useAppSelector from "../../reducers/useAppSelector";
import useLoad, { useLoadOnMount } from "../shared/useLoad";

interface IProps {
  type: ActivityType;
  language: ILanguage;

  heading?: string; // Default "Activities"
  basePath: string;

  // Added below
  activities: List<IActivity>;
  saveLoad: ReturnType<typeof useLoad>[0];
}

export default function ActivitiesTable(
  props: Omit<IProps, "activities" | "saveLoad">
) {
  const activities = useAppSelector(state => state.activities).filter(
    propMatcher(props)
  );

  const [saveLoad] = useLoad();
  useLoadOnMount(`/api/activities?language_id=${props.language.id}`);

  return <BaseActivitiesTable {...props} {...{ activities, saveLoad }} />;
}

function propMatcher(props: { type: ActivityType; language: ILanguage }) {
  return (activity: IActivity) => {
    if (activity.language_id != props.language.id) return false;

    if (props.type == "Research" || props.type == "Workshops") {
      return (
        activity.type == "LinguisticActivity" && activity.category == props.type
      );
    }

    return `${props.type}Activity` == activity.type;
  };
}

interface IState {
  showNewForm: boolean;
  newFormSaving: boolean;
}

class BaseActivitiesTable extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = this.freshState();
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
    const data = await this.props.saveLoad(duluAxios =>
      duluAxios.post(
        `/api/languages/${this.props.language.id}/${this.x_activities()}/`,
        {
          [this.x_activity()]: activity
        }
      )
    );
    if (data) {
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
            <StyledTable>
              <tbody>
                {this.props.activities.map(activity => (
                  <ActivityRow
                    key={activity.id}
                    activity={activity}
                    can={this.props.language.can}
                    basePath={this.props.basePath}
                  />
                ))}
              </tbody>
            </StyledTable>
          </div>
        )}
      </I18nContext.Consumer>
    );
  }
}
