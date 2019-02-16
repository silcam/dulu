import { connect } from "react-redux";
import * as regionActionCreators from "../../actions/regionActions";
import { AppState } from "../../reducers/clustersReducer";
import { IRegion } from "../../models/Region";
import { addPeople } from "../../actions/peopleActions";
import { addLanguages } from "../../actions/languageActions";
import { addClusters } from "../../actions/clusterActions";
import RegionsBoard from "./RegionsBoard";

const mapStateToProps = (state: AppState) => ({
  regions: state.regions.list.map(id => state.regions.byId[id]) as IRegion[]
});

const mapDispatchToProps = {
  ...regionActionCreators,
  addPeople,
  addLanguages,
  addClusters
};

const RegionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegionsBoard);

export default RegionsContainer;
