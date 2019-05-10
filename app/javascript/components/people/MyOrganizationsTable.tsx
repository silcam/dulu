import React from "react";
import MyOrganizationsTableRow from "./MyOrganizationsTableRow";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import DuluAxios from "../../util/DuluAxios";
import InlineAddIcon from "../shared/icons/InlineAddIcon";
import { OrganizationPicker } from "../shared/SearchPicker";
import { IPerson } from "../../models/Person";
import List from "../../models/List";
import { IOrganization, IOrganizationPerson } from "../../models/Organization";
import { Adder, Setter } from "../../models/TypeBucket";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  person: IPerson;
  organizationPeople: List<IOrganizationPerson>;
  organizations: List<IOrganization>;
  addOrganizationPeople: Adder<IOrganizationPerson>;
  setOrganizationPerson: Setter<IOrganizationPerson>;
  deleteOrganizationPerson: (id: number) => void;
  addPeople: Adder<IPerson>;
  addOrganizations: Adder<IOrganization>;
}

interface IState {
  newOrganization: IOrganization | null;
  addingNew?: boolean;
}

export default class MyOrganizationsTable extends React.PureComponent<
  IProps,
  IState
> {
  state: IState = {
    newOrganization: null
  };

  async componentDidMount() {
    const data = await DuluAxios.get(`/api/organization_people`, {
      person_id: this.props.person.id
    });
    if (data) {
      this.props.addPeople(data.people);
      this.props.addOrganizations(data.organizations);
      this.props.addOrganizationPeople(data.organization_people);
    }
  }

  createOrganizationPerson = async () => {
    if (!this.state.newOrganization) return;
    const organizationPerson = {
      person_id: this.props.person.id,
      organization_id: this.state.newOrganization.id
    };
    const data = await DuluAxios.post("/api/organization_people", {
      organization_person: organizationPerson
    });
    if (data) {
      this.props.addOrganizations([data.organization]);
      this.props.setOrganizationPerson(data.organization_person);
      this.setState({ addingNew: false });
    }
  };

  render() {
    return (
      <I18nContext.Consumer>
        {t => (
          <div>
            <h3>
              {t("Organizations")}
              {this.props.person.can.update && (
                <InlineAddIcon
                  onClick={() => this.setState({ addingNew: true })}
                />
              )}
            </h3>
            <table>
              <tbody>
                {this.props.organizationPeople.map(org_person => (
                  <MyOrganizationsTableRow
                    key={org_person.id}
                    canUpdate={this.props.person.can.update}
                    org_person={org_person}
                    organization={this.props.organizations.get(
                      org_person.organization_id
                    )}
                    person={this.props.person}
                    setOrganizationPerson={this.props.setOrganizationPerson}
                    deleteOrganizationPerson={
                      this.props.deleteOrganizationPerson
                    }
                  />
                ))}
                {this.state.addingNew && (
                  <tr>
                    <td colSpan={4}>
                      <OrganizationPicker
                        collection={this.props.organizations.asById()}
                        selectedId={
                          this.state.newOrganization &&
                          this.state.newOrganization.id
                        }
                        setSelected={org =>
                          this.setState({ newOrganization: org })
                        }
                        autoFocus
                        allowBlank
                      />
                      <SmallSaveAndCancel
                        handleSave={this.createOrganizationPerson}
                        handleCancel={() => this.setState({ addingNew: false })}
                        saveDisabled={!this.state.newOrganization}
                        style={{ marginTop: "8px" }}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </I18nContext.Consumer>
    );
  }
}
