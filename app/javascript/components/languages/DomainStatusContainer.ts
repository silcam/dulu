import { setLanguage } from "../../actions/languageActions";
import { addPeople } from "../../actions/peopleActions";
import { addOrganizations } from "../../actions/organizationActions";
import { AppState } from "../../reducers/appReducer";
import { connect } from "react-redux";
import DomainStatus from "./DomainStatus";
import DomainStatusItemPage from "./DomainStatusItemPage";
import DomainStatusDataCollectionPage from "./DomainStatusDataCollectionPage";

const mapStateToProps = (state: AppState) => ({
  people: state.people,
  organizations: state.organizations
});

const mapDispatchToProps = {
  setLanguage,
  addPeople,
  addOrganizations
};

export const DomainStatusItemPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DomainStatusItemPage);

export const DomainStatusDataCollectionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DomainStatusDataCollectionPage);

const DomainStatusContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DomainStatus);

export default DomainStatusContainer;
