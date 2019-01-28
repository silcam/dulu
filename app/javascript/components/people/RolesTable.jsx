import React from "react";
import PropTypes from "prop-types";
import AddRoleRow from "./AddRoleRow";
import DeleteIcon from "../shared/icons/DeleteIcon";
import DuluAxios from "../../util/DuluAxios";
import InlineAddIcon from "../shared/icons/InlineAddIcon";

export default class RolesTable extends React.PureComponent {
  state = {};

  addRole = async () => {};

  deleteRole = async role => {
    try {
      const data = await DuluAxios.post(`/api/person_roles/finish`, {
        person_id: this.props.person.id,
        role: role
      });
      this.props.replaceRoles(data.roles);
    } catch (error) {
      this.props.setNetworkError({ tryAgain: () => this.deleteRole(role) });
    }
  };

  canUpdateRoles = person =>
    person.can.update && person.grantable_roles.length > 0;

  render() {
    const person = this.props.person;
    const t = this.props.t;

    if (!this.canUpdateRoles(person) && person.roles.length == 0) return null;

    return (
      <div id="rolesTable">
        <h3>
          {t("Roles")}
          {this.canUpdateRoles(person) && (
            <InlineAddIcon onClick={() => this.setState({ addingNew: true })} />
          )}
        </h3>
        <table>
          <tbody>
            {person.roles.map(role => {
              return (
                <tr key={role.value}>
                  <td>{role.display}</td>
                  {person.can.update && (
                    <td>
                      <DeleteIcon
                        onClick={() => {
                          if (
                            window.confirm(
                              t("confirm_delete_role", {
                                role: role.display
                              })
                            )
                          )
                            this.deleteRole(role.value);
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
                t={t}
                replaceRoles={this.props.replaceRoles}
                setNetworkError={this.props.setNetworkError}
                cancel={() => this.setState({ addingNew: false })}
              />
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

RolesTable.propTypes = {
  t: PropTypes.func.isRequired,
  person: PropTypes.object.isRequired,
  replaceRoles: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired
};
