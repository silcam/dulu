import { connect } from "react-redux";
import * as organizationPeopleActionCreators from "../../actions/organizationPeopleActions";
import MyOrganizationsTable from "./MyOrganizationsTable";
import { addPeople } from "../../actions/peopleActions";
import { addOrganizations } from "../../actions/organizationActions";
import { AppState } from "../../reducers/appReducer";
import { IPerson } from "../../models/Person";

interface IProps {
  person: IPerson;
}

const mapStateToProps = (state: AppState, ownProps: IProps) => {
  return {
    organizationPeople: state.organizationPeople.filter(
      op => op.person_id == ownProps.person.id
    ),
    // peopleById: state.people.byId,
    organizations: state.organizations
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
