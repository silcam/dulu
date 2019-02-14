import { connect } from "react-redux";
import { fullName } from "../../models/Person";
import * as eventActionCreators from "../../actions/eventActions";
import { addPeople } from "../../actions/peopleActions";
import { addLanguages } from "../../actions/languageActions";
import { addClusters } from "../../actions/clusterActions";
import {
  addActivities,
  deleteWorkshopEvent
} from "../../actions/activityActions";
import EventView from "./EventView";

const mapStateToProps = (state, ownProps) => {
  const event = state.events.byId[ownProps.id];
  if (!event) return { event: event };
  return {
    event: event,
    eventLanguages: event.language_ids.map(id => state.languages.byId[id]),
    eventClusters: event.cluster_ids.map(id => state.clusters.byId[id]),
    eventParticipants: event.event_participants.map(e_p => ({
      ...e_p,
      full_name: fullName(state.people.byId[e_p.person_id])
    }))
  };
};

const mapDispatchToProps = {
  ...eventActionCreators,
  addPeople,
  addClusters,
  addLanguages,
  addActivities,
  deleteWorkshopEvent
};

const EventContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventView);

export default EventContainer;
