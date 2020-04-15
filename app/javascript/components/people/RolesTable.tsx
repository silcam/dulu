import React, { useState } from "react";
import AddRoleRow from "./AddRoleRow";
import DeleteIcon from "../shared/icons/DeleteIcon";
import InlineAddIcon from "../shared/icons/InlineAddIcon";
import { IPerson } from "../../models/Person";
import useTranslation from "../../i18n/useTranslation";
import useLoad from "../shared/useLoad";

interface IProps {
  person: IPerson;
}

export default function RolesTable(props: IProps) {
  const t = useTranslation();
  const [saveLoad] = useLoad();

  const [addingNew, setAddingNew] = useState(false);
  const canUpdateRoles =
    props.person.can.update && props.person.grantable_roles.length > 0;

  const deleteRole = async (role: string) => {
    const data = await saveLoad(duluAxios =>
      duluAxios.post("/api/person_roles/finish", {
        person_id: props.person.id,
        role: role
      })
    );
  };

  const person = props.person;

  if (!canUpdateRoles && person.roles.length == 0) return null;

  return (
    <div id="rolesTable">
      <h3>
        {t("Roles")}
        {canUpdateRoles && <InlineAddIcon onClick={() => setAddingNew(true)} />}
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
                          deleteRole(role);
                      }}
                    />
                  </td>
                )}
              </tr>
            );
          })}
          {addingNew && (
            <AddRoleRow person={person} cancel={() => setAddingNew(false)} />
          )}
        </tbody>
      </table>
    </div>
  );
}
