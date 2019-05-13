import { connect } from "react-redux";
import * as activityActionCreators from "../../actions/activityActions";
import { setLanguage } from "../../actions/languageActions";
import ActivitiesTable from "./ActivitiesTable";
import { IActivity, ActivityType } from "../../models/Activity";
import { ILanguage } from "../../models/Language";
import { AppState } from "../../reducers/appReducer";

interface IProps {
  language: ILanguage;
  type: ActivityType;
}

const mapStateToProps = (state: AppState, ownProps: IProps) => ({
  activities: state.activities.filter(propMatcher(ownProps))
});

function propMatcher(props: IProps) {
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

const mapDispatchToProps = {
  ...activityActionCreators,
  setLanguage
};

const ActivitiesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivitiesTable);

export default ActivitiesContainer;
