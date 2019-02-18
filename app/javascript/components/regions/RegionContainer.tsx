import { connect } from "react-redux";
import { AppState } from "../../reducers/appReducer";
import Region from "../../models/Region";
import * as regionActionCreators from "../../actions/regionActions";
import { addPeople } from "../../actions/peopleActions";
import { addLanguages } from "../../actions/languageActions";
import { addClusters } from "../../actions/clusterActions";
import RegionPage from "./RegionPage";

interface IProps {
  id: number;
}

const mapStateToProps = (state: AppState, ownProps: IProps) => {
  const region = state.regions.byId[ownProps.id];
  return region
    ? {
        region: Region.inflate(state, region)
      }
    : {};
};

const mapDispatchToProps = {
  ...regionActionCreators,
  addPeople,
  addLanguages,
  addClusters
};

const RegionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegionPage);

export default RegionContainer;
