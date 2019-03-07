import { setLanguage } from "../../actions/languageActions";
import { addPeople } from "../../actions/peopleActions";
import { addOrganizations } from "../../actions/organizationActions";
import { AppState } from "../../reducers/appReducer";
import { connect } from "react-redux";
import DomainStatus from "./DomainStatus";
import DomainStatusItemPage from "./DomainStatusItemPage";

const mapStateToProps = (state: AppState) => ({
  people: state.people.byId,
  organizations: state.organizations.byId
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

const DomainStatusContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DomainStatus);

export default DomainStatusContainer;
