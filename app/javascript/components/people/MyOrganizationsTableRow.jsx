import React from "react";
import EditIcon from "../shared/icons/EditIcon";
import DeleteIcon from "../shared/icons/DeleteIcon";
import MyOrganizationForm from "./MyOrganizationForm";
import { Link } from "react-router-dom";
import dateString from "../../util/dateString";
import DuluAxios from "../../util/DuluAxios";

export default class MyOrganizationsTableRow extends React.PureComponent {
  state = {};

  updateOrganizationPerson = async organization_person => {
    try {
      const data = await DuluAxios.put(
        `/api/organization_people/${organization_person.id}`,
        {
          organization_person: organization_person
        }
      );
      this.props.replaceOrganizationPerson(data.organization_person);
      this.setState({ editing: false });
    } catch (error) {
      this.props.setNetworkError({
        tryAgain: () => this.updateOrganizationPerson(organization_person)
      });
    }
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
        {this.props.canUpdate && (
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
        )}
      </tr>
    );
  }
}
