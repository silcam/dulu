import { connect } from "react-redux";
import * as organizationPeopleActionCreators from "../../actions/organizationPeopleActions";
import MyOrganizationsTable from "./MyOrganizationsTable";
import { addPeople } from "../../actions/peopleActions";
import { addOrganizations } from "../../actions/organizationActions";

const mapStateToProps = (state, ownProps) => {
  return {
    organizationPeople: Object.values(state.organizationPeople).filter(
      op => op.person_id == ownProps.person.id
    ),
    // peopleById: state.people.byId,
    organizationsById: state.organizations.byId
  };
};

const mapDispatchToProps = {
  ...organizationPeopleActionCreators,
  addPeople,
  addOrganizations
};

const OrgPeopleContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MyOrganizationsTable);

export default OrgPeopleContainer;
