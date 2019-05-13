import { connect } from "react-redux";
import { AppState } from "../../reducers/appReducer";
import { ILanguage } from "../../models/Language";
import { ICluster } from "../../models/Cluster";
import { setRegions } from "../../actions/regionActions";
import { setClusters } from "../../actions/clusterActions";
import { setLanguages } from "../../actions/languageActions";
import { addParticipants } from "../../actions/participantActions";
import DashboardSidebar from "./DashboardSidebar";
import { User } from "../../application/DuluApp";
import { IRegion } from "../../models/Region";
import { addPeople } from "../../actions/peopleActions";
import List from "../../models/List";

interface IProps {
  user: User;
}

export interface LoadedCluster extends ICluster {
  languages: List<ILanguage>;
}

export interface LoadedRegion extends IRegion {
  clusters: List<LoadedCluster>;
  languages: List<ILanguage>;
}

const mapStateToProps = (state: AppState, ownProps: IProps) => {
  const languages = state.languages;
  const clusters: List<LoadedCluster> = state.clusters.mapToList(cluster => ({
    ...cluster,
    languages: languages.filter(lang => lang.cluster_id == cluster.id)
  }));
  const userParticipants = state.participants.filter(
    ptpt => ptpt.person_id == ownProps.user.id
  );
  const regions: List<LoadedRegion> = state.regions.mapToList(region => ({
    ...region,
    clusters: clusters.filter(c => c.region_id == region.id),
    languages: languages.filter(lang => lang.region_id == region.id)
  }));
  return {
    regions,
    userPrograms: {
      clusters: userParticipants
        .filter(ptpt => !!ptpt.cluster_id)
        .map(ptpt => clusters.get(ptpt.cluster_id!)),
      languages: userParticipants
        .filter(ptpt => !!ptpt.language_id)
        .map(ptpt => state.languages.get(ptpt.language_id!))
    }
  };
};

const mapDispatchToProps = {
  setRegions,
  setClusters,
  setLanguages,
  addParticipants,
  addPeople
};

const DashboardSidebarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardSidebar);

export default DashboardSidebarContainer;
