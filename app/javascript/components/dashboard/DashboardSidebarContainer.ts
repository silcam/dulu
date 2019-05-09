import { connect } from "react-redux";
import { AppState } from "../../reducers/appReducer";
import { IParticipant } from "../../models/Participant";
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
  clusters: LoadedCluster[];
  languages: List<ILanguage>;
}

const mapStateToProps = (state: AppState, ownProps: IProps) => {
  const languages = state.languages;
  const clusters = state.clusters.map(cluster => ({
    ...cluster,
    languages: languages.filter(lang => lang.cluster_id == cluster.id)
  })) as LoadedCluster[];
  const userParticipants = (Object.values(
    state.participants
  ) as IParticipant[]).filter(ptpt => ptpt.person_id == ownProps.user.id);
  return {
    regions: state.regions.map(region => ({
      ...region,
      clusters: clusters.filter(c => c.region_id == region.id),
      languages: languages.filter(lang => lang.region_id == region.id)
    })) as LoadedRegion[],
    userPrograms: {
      clusters: userParticipants
        .filter(ptpt => !!ptpt.cluster_id)
        .map(ptpt =>
          clusters.find(c => c.id == ptpt.cluster_id)
        ) as LoadedCluster[],
      languages: userParticipants
        .filter(ptpt => !!ptpt.language_id)
        .map(ptpt => state.languages.get(ptpt.language_id!)) as ILanguage[]
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
