import React from "react";
import EditIcon from "../shared/icons/EditIcon";
import DeleteIcon from "../shared/icons/DeleteIcon";
import MyOrganizationForm from "./MyOrganizationForm";
import Spacer from "../shared/Spacer";

export default class MyOrganizationsTableRow extends React.PureComponent {
  state = {};

  updateOrganizationPerson = organization_person => {
    this.setState({ editing: false });
    this.props.updateOrganizationPerson(organization_person);
  };

  render() {
    return this.state.editing ? (
      <MyOrganizationForm
        t={this.props.t}
        organization_person={this.props.org_person}
        cancelEdit={() => this.setState({ editing: false })}
        updateOrganizationPerson={this.updateOrganizationPerson}
      />
    ) : (
      <tr>
        <td>
          {this.props.org_person.organization.name}
          {this.props.org_person.position &&
            ` - ${this.props.org_person.position}`}
          <Spacer width="12px" />
          <EditIcon onClick={() => this.setState({ editing: true })} />
          <DeleteIcon />
        </td>
      </tr>
    );
  }
}
