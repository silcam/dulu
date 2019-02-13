import { connect } from "react-redux";
import * as activityActionCreators from "../../actions/activityActions";
import { setLanguage } from "../../actions/languageActions";
import ActivitiesTable from "./ActivitiesTable";
import Activity from "../../models/Activity";

const mapStateToProps = (state, ownProps) => ({
  activities: Object.values(state.activities)
    .filter(propMatcher(ownProps))
    .sort(Activity.compare)
});

function propMatcher(props) {
  return activity => {
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
