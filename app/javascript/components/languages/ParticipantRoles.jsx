import React from "react";
import PropTypes from "prop-types";
import { arrayDelete } from "../../util/arrayUtils";
import DeleteIcon from "../shared/icons/DeleteIcon";
import AddRole from "../shared/AddRole";
import style from "./ParticipantRoles.css";

export default function ParticipantRoles(props) {
  const t = props.t;
  const participant = props.participant;

  return props.editing ? (
    <div>
      <h3>{t("Roles")}</h3>
      <table className={style.simple}>
        <tbody>
          {participant.roles.map(role => (
            <tr key={role}>
              <td>{t(`roles.${role}`)}</td>
              <td>
                <DeleteIcon
                  onClick={() =>
                    props.replaceRoles(arrayDelete(participant.roles, role))
                  }
                />
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="2">
              <AddRole
                t={t}
                addRole={role =>
                  props.replaceRoles(participant.roles.concat([role]))
                }
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : (
    <div style={{ fontSize: "larger" }}>
      {participant.roles.length > 0
        ? participant.roles.map(role => t(`roles.${role}`)).join(", ")
        : t("No_roles_assigned")}
    </div>
  );
}

ParticipantRoles.propTypes = {
  t: PropTypes.func.isRequired,
  participant: PropTypes.object.isRequired,
  replaceRoles: PropTypes.func.isRequired,
  editing: PropTypes.bool
};
