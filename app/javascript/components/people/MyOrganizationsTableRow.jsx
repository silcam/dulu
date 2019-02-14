import React from "react";
import PropTypes from "prop-types";
import EditIcon from "../shared/icons/EditIcon";
import DeleteIcon from "../shared/icons/DeleteIcon";
import MyOrganizationForm from "./MyOrganizationForm";
import { Link } from "react-router-dom";
import dateString from "../../util/dateString";
import DuluAxios from "../../util/DuluAxios";
import { fullName } from "../../models/Person";

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
      this.props.setOrganizationPerson(data.organization_person);
      this.setState({ editing: false });
    } catch (error) {
      this.props.setNetworkError(error);
    }
  };

  deleteOrganizationPerson = async () => {
    try {
      await DuluAxios.delete(
        `/api/organization_people/${this.props.org_person.id}`
      );
      this.props.deleteOrganizationPerson(this.props.org_person.id);
    } catch (error) {
      this.props.setNetworkError(error);
    }
  };

  render() {
    const orgPerson = this.props.org_person;
    const organization = this.props.organization;
    return this.state.editing ? (
      <MyOrganizationForm
        t={this.props.t}
        organization_person={orgPerson}
        organization={organization}
        cancelEdit={() => this.setState({ editing: false })}
        updateOrganizationPerson={this.updateOrganizationPerson}
      />
    ) : (
      <tr>
        <td>
          <Link to={`/organizations/show/${organization.id}`}>
            {organization.short_name}
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
                      org: organization.short_name,
                      person: fullName(this.props.person)
                    })
                  )
                )
                  this.deleteOrganizationPerson();
              }}
            />
          </td>
        )}
      </tr>
    );
  }
}

MyOrganizationsTableRow.propTypes = {
  setNetworkError: PropTypes.func.isRequired,
  org_person: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  person: PropTypes.object.isRequired,
  canUpdate: PropTypes.bool,
  setOrganizationPerson: PropTypes.func.isRequired,
  deleteOrganizationPerson: PropTypes.func.isRequired
};
