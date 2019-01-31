import { connect } from "react-redux";
import * as organizationActionCreators from "../../actions/organizationActions";
import OrganizationsBoard from "./OrganizationsBoard";

const mapStateToProps = state => ({
  organizations: state.organizations.list.map(
    id => state.organizations.byId[id]
  )
});

const OrganizationsContainer = connect(
  mapStateToProps,
  organizationActionCreators
)(OrganizationsBoard);

export default OrganizationsContainer;
