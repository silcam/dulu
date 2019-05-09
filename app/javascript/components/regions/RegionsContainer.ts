import { connect } from "react-redux";
import * as regionActionCreators from "../../actions/regionActions";
import { AppState } from "../../reducers/appReducer";
import { addPeople } from "../../actions/peopleActions";
import { addLanguages } from "../../actions/languageActions";
import { addClusters } from "../../actions/clusterActions";
import RegionsBoard from "./RegionsBoard";
import { setCan } from "../../actions/canActions";

const mapStateToProps = (state: AppState) => ({
  regions: state.regions,
  can: state.can.regions
});

const mapDispatchToProps = {
  ...regionActionCreators,
  addPeople,
  addLanguages,
  addClusters,
  setCan
};

const RegionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegionsBoard);

export default RegionsContainer;
