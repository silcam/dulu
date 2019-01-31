import { connect } from "react-redux";
import * as organizationActionCreators from "../../actions/organizationActions";
import OrganizationPage from "./OrganizationPage";

const mapStateToProps = (state, ownProps) => ({
  organization: state.organizations.byId[ownProps.id]
});

const OrganizationContainer = connect(
  mapStateToProps,
  organizationActionCreators
)(OrganizationPage);

export default OrganizationContainer;
