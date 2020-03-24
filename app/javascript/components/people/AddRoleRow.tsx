import React, { useState } from "react";
import SelectInput from "../shared/SelectInput";
import DuluAxios from "../../util/DuluAxios";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import { IPerson } from "../../models/Person";
import useTranslation from "../../i18n/useTranslation";

interface IProps {
  person: IPerson;
  replaceRoles: (roles: string[]) => void;
  cancel: () => void;
}

export default function AddRoleRow(props: IProps) {
  const t = useTranslation();

  const [role, setRole] = useState(props.person.grantable_roles[0]);

  const addRole = async () => {
    const data = await DuluAxios.post("/api/person_roles", {
      person_id: props.person.id,
      role
    });
    if (data) {
      props.replaceRoles(data.roles);
      props.cancel();
    }
  };

  return (
    <tr>
      <td>
        <SelectInput
          value={role}
          options={SelectInput.translatedOptions(
            props.person.grantable_roles,
            t,
            "roles"
          )}
          setValue={setRole}
          autoFocus
        />
        <SmallSaveAndCancel
          handleSave={addRole}
          handleCancel={props.cancel}
          style={{ marginTop: "8px" }}
        />
      </td>
    </tr>
  );
}
