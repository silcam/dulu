import React from "react";
import EditIcon from "../shared/icons/EditIcon";
import DeleteIcon from "../shared/icons/DeleteIcon";
import MyOrganizationForm from "./MyOrganizationForm";
import { Link } from "react-router-dom";
import dateString from "../../util/dateString";

export default class MyOrganizationsTableRow extends React.PureComponent {
  state = {};

  updateOrganizationPerson = organization_person => {
    this.setState({ editing: false });
    this.props.updateOrganizationPerson(organization_person);
  };

  render() {
    const orgPerson = this.props.org_person;
    return this.state.editing ? (
      <MyOrganizationForm
        t={this.props.t}
        organization_person={orgPerson}
        cancelEdit={() => this.setState({ editing: false })}
        updateOrganizationPerson={this.updateOrganizationPerson}
      />
    ) : (
      <tr>
        <td>
          <Link to={`/organizations/show/${orgPerson.organization.id}`}>
            {orgPerson.organization.name}
          </Link>
        </td>
        <td>
          {orgPerson.start_date &&
            `${dateString(
              orgPerson.start_date,
              this.props.t("month_names_short")
            )} - ${dateString(
              orgPerson.end_date,
              this.props.t("month_names_short")
            )}`}
        </td>
        <td>{orgPerson.position}</td>
        <td>
          <EditIcon onClick={() => this.setState({ editing: true })} />
          <DeleteIcon
            onClick={() => {
              if (
                window.confirm(
                  this.props.t("confirm_delete_org_person", {
                    org: orgPerson.organization.name,
                    person: orgPerson.person.full_name
                  })
                )
              )
                this.props.deleteOrganizationPerson(orgPerson.id);
            }}
          />
        </td>
      </tr>
    );
  }
}
