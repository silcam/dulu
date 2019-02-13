import { connect } from "react-redux";
import * as eventActionCreators from "../../actions/eventActions";
import { addPeople } from "../../actions/peopleActions";
import { addLanguages } from "../../actions/languageActions";
import { addClusters } from "../../actions/clusterActions";
import { setEventsCan } from "../../actions/canActions";
import EventsCalendar from "./EventsCalendar";

const mapStateToProps = state => ({
  can: state.can.events
});

const mapDispatchToProps = {
  ...eventActionCreators,
  addPeople,
  addLanguages,
  addClusters,
  setEventsCan
};

const EventsCalendarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventsCalendar);

export default EventsCalendarContainer;
