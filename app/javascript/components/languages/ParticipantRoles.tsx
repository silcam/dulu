import React, { useContext } from "react";
import { arrayDelete } from "../../util/arrayUtils";
import DeleteIcon from "../shared/icons/DeleteIcon";
import AddRole from "../shared/AddRole";
import style from "./ParticipantRoles.css";
import { IParticipant } from "../../models/Participant";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  participant: IParticipant;
  replaceRoles: (roles: string[]) => void;
  editing?: boolean;
}

export default function ParticipantRoles(props: IProps) {
  const t = useContext(I18nContext);
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
            <td colSpan={2}>
              <AddRole
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
