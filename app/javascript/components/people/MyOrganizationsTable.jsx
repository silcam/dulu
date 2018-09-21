import React from "react";
import MyOrganizationsTableRow from "./MyOrganizationsTableRow";
import Axios from "axios";
import { findIndexById } from "../../util/findById";
import update from "immutability-helper";

export default class MyOrganizationsTable extends React.PureComponent {
  updateOrganizationPerson = async organizationPerson => {
    const response = await Axios.put(
      `/api/organization_people/${organizationPerson.id}`,
      {
        authenticity_token: this.props.authToken,
        organization_person: organizationPerson
      }
    );
    if (response.data.organization_person) {
      const newOrganizationPerson = response.data.organization_person;
      this.props.replaceOrganizationPeople(
        update(this.props.person.organization_people, {
          [findIndexById(
            this.props.person.organization_people,
            newOrganizationPerson.id
          )]: { $set: newOrganizationPerson }
        })
      );
    }
  };

  render() {
    return (
      <div>
        <h3> {this.props.t("Organizations")} </h3>
        <table>
          <tbody>
            {this.props.person.organization_people.map(org_person => (
              <MyOrganizationsTableRow
                key={org_person.id}
                t={this.props.t}
                editing={this.props.editing}
                org_person={org_person}
                updateOrganizationPerson={this.updateOrganizationPerson}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
