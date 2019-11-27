import React from "react";
import AddRoleRow from "./AddRoleRow";
import DeleteIcon from "../shared/icons/DeleteIcon";
import DuluAxios from "../../util/DuluAxios";
import InlineAddIcon from "../shared/icons/InlineAddIcon";
import { IPerson } from "../../models/Person";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  person: IPerson;
  replaceRoles: (roles: string[]) => void;
}

interface IState {
  addingNew?: boolean;
}

export default class RolesTable extends React.PureComponent<IProps, IState> {
  state: IState = {};

  deleteRole = async (role: string) => {
    const data = await DuluAxios.post(`/api/person_roles/finish`, {
      person_id: this.props.person.id,
      role: role
    });
    if (data) {
      this.props.replaceRoles(data.roles);
    }
  };

  canUpdateRoles = (person: IPerson) =>
    person.can.update && person.grantable_roles.length > 0;

  render() {
    const person = this.props.person;

    if (!this.canUpdateRoles(person) && person.roles.length == 0) return null;

    return (
      <I18nContext.Consumer>
        {t => (
          <div id="rolesTable">
            <h3>
              {t("Roles")}
              {this.canUpdateRoles(person) && (
                <InlineAddIcon
                  onClick={() => this.setState({ addingNew: true })}
                />
              )}
            </h3>
            <table>
              <tbody>
                {person.roles.map(role => {
                  return (
                    <tr key={role}>
                      <td>{t(`roles.${role}`)}</td>
                      {person.can.update && (
                        <td>
                          <DeleteIcon
                            onClick={() => {
                              if (
                                window.confirm(
                                  t("confirm_delete_role", {
                                    role: t(`roles.${role}`)
                                  })
                                )
                              )
                                this.deleteRole(role);
                            }}
                          />
                        </td>
                      )}
                    </tr>
                  );
                })}
                {this.state.addingNew && (
                  <AddRoleRow
                    person={person}
                    replaceRoles={this.props.replaceRoles}
                    cancel={() => this.setState({ addingNew: false })}
                  />
                )}
              </tbody>
            </table>
          </div>
        )}
      </I18nContext.Consumer>
    );
  }
}
