import React, { useState } from "react";
import SelectInput from "../shared/SelectInput";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import { IPerson } from "../../models/Person";
import useTranslation from "../../i18n/useTranslation";
import useLoad from "../shared/useLoad";

interface IProps {
  person: IPerson;
  cancel: () => void;
}

export default function AddRoleRow(props: IProps) {
  const t = useTranslation();
  const [saveLoad] = useLoad();

  const [role, setRole] = useState(props.person.grantable_roles[0]);

  const addRole = async () => {
    const data = await saveLoad(duluAxios =>
      duluAxios.post("/api/person_roles", {
        person_id: props.person.id,
        role
      })
    );
    if (data) props.cancel();
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
