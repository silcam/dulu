import { connect } from "react-redux";
import { setEvent } from "../../actions/eventActions";
import NewEventForm from "./NewEventForm";
import { addLanguages } from "../../actions/languageActions";
import { addClusters } from "../../actions/clusterActions";
import { addPeople } from "../../actions/peopleActions";
import { addActivities } from "../../actions/activityActions";

const mapDispatchToProps = {
  setEvent,
  addLanguages,
  addPeople,
  addClusters,
  addActivities
};

const NewEventFormContainer = connect(
  null,
  mapDispatchToProps
)(NewEventForm);

export default NewEventFormContainer;
