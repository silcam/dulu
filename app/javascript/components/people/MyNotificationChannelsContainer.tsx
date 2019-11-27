import { AppState } from "../../reducers/appReducer";
import { connect } from "react-redux";
import MyNotificationChannels from "./MyNotificationChannels";

const mapStateToProps = (state: AppState) => ({
  languages: state.languages,
  clusters: state.clusters,
  regions: state.regions
});

const MyNotificationChannelsContainer = connect(mapStateToProps)(
  MyNotificationChannels
);

export default MyNotificationChannelsContainer;
