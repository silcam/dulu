import { connect } from "react-redux";
import * as organizationActionCreators from "../../actions/organizationActions";
import OrganizationsBoard from "./OrganizationsBoard";
import { setCan } from "../../actions/canActions";
import { AppState } from "../../reducers/appReducer";

const mapStateToProps = (state: AppState) => ({
  organizations: state.organizations,
  can: state.can.organizations
});

const OrganizationsContainer = connect(
  mapStateToProps,
  { ...organizationActionCreators, setCan }
)(OrganizationsBoard);

export default OrganizationsContainer;
