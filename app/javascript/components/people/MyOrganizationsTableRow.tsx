import React from "react";
import EditIcon from "../shared/icons/EditIcon";
import DeleteIcon from "../shared/icons/DeleteIcon";
import MyOrganizationForm from "./MyOrganizationForm";
import { Link } from "react-router-dom";
import dateString from "../../util/dateString";
import DuluAxios from "../../util/DuluAxios";
import { fullName, IPerson } from "../../models/Person";
import { IOrganizationPerson, IOrganization } from "../../models/Organization";
import { Setter } from "../../models/TypeBucket";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  org_person: IOrganizationPerson;
  organization: IOrganization;
  person: IPerson;
  canUpdate?: boolean;
  setOrganizationPerson: Setter<IOrganizationPerson>;
  deleteOrganizationPerson: (id: number) => void;
}

interface IState {
  editing?: boolean;
}

export default class MyOrganizationsTableRow extends React.PureComponent<
  IProps,
  IState
> {
  state: IState = {};

  updateOrganizationPerson = async (
    organization_person: IOrganizationPerson
  ) => {
    const data = await DuluAxios.put(
      `/api/organization_people/${organization_person.id}`,
      {
        organization_person: organization_person
      }
    );
    if (data) {
      this.props.setOrganizationPerson(data.organization_person);
      this.setState({ editing: false });
    }
  };

  deleteOrganizationPerson = async () => {
    const success = await DuluAxios.delete(
      `/api/organization_people/${this.props.org_person.id}`
    );
    if (success) {
      this.props.deleteOrganizationPerson(this.props.org_person.id);
    }
  };

  render() {
    const orgPerson = this.props.org_person;
    const organization = this.props.organization;
    return this.state.editing ? (
      <MyOrganizationForm
        organization_person={orgPerson}
        organization={organization}
        cancelEdit={() => this.setState({ editing: false })}
        updateOrganizationPerson={this.updateOrganizationPerson}
      />
    ) : (
      <I18nContext.Consumer>
        {t => (
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
                  t("month_names_short")
                )} - ${dateString(orgPerson.end_date, t("month_names_short"))}`}
            </td>
            <td>{orgPerson.position}</td>
            {this.props.canUpdate && (
              <td>
                <EditIcon onClick={() => this.setState({ editing: true })} />
                <DeleteIcon
                  onClick={() => {
                    if (
                      window.confirm(
                        t("confirm_delete_org_person", {
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
        )}
      </I18nContext.Consumer>
    );
  }
}
