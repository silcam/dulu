import { connect } from "react-redux";
import * as eventActionCreators from "../../actions/eventActions";
import { addPeople } from "../../actions/peopleActions";
import { addLanguages } from "../../actions/languageActions";
import { addClusters } from "../../actions/clusterActions";
import { setCan } from "../../actions/canActions";
import EventsCalendar from "./EventsCalendar";

const mapStateToProps = state => ({
  can: state.can.events
});

const mapDispatchToProps = {
  ...eventActionCreators,
  addPeople,
  addLanguages,
  addClusters,
  setCan
};

const EventsCalendarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventsCalendar);

export default EventsCalendarContainer;
