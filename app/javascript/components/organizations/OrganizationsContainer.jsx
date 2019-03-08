import { connect } from "react-redux";
import * as organizationActionCreators from "../../actions/organizationActions";
import OrganizationsBoard from "./OrganizationsBoard";
import { setCan } from "../../actions/canActions";

const mapStateToProps = state => ({
  organizations: state.organizations.list.map(
    id => state.organizations.byId[id]
  ),
  can: state.can.organizations
});

const OrganizationsContainer = connect(
  mapStateToProps,
  { ...organizationActionCreators, setCan }
)(OrganizationsBoard);

export default OrganizationsContainer;
